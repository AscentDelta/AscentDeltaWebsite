import { Router } from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { Resend } from 'resend';

const router = Router();

// Key ring: OPENROUTER_API_KEYS is a comma-separated list rotated automatically
// when a key is exhausted; legacy single OPENROUTER_API_KEY rides along as a
// final fallback if it differs.
const OPENROUTER_KEYS = () => {
  const ring = (process.env.OPENROUTER_API_KEYS || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  if (process.env.OPENROUTER_API_KEY) ring.push(process.env.OPENROUTER_API_KEY.trim());
  return [...new Set(ring)];
};

// Best-first ladder of free models, verified against the live OpenRouter
// catalog on 2026-07-11. Any model failure advances down the ladder; a key
// exhaustion switches keys and restarts from the top.
const OPENROUTER_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'tencent/hy3:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'poolside/laguna-m.1:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-coder:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'openai/gpt-oss-20b:free',
];

// Keys that hit their daily/credit ceiling are skipped for a cooldown window
// so later scans don't burn attempts on a dead key.
const keyExhaustedUntil = new Map();
const KEY_COOLDOWN_MS = 15 * 60 * 1000;

// Key-level failures end the model ladder for that key; everything else is a
// model-level failure and just advances to the next model.
function isKeyLevelError(status, message = '') {
  if (status === 401 || status === 402 || status === 403) return true;
  if (status === 429) {
    const msg = message.toLowerCase();
    return (
      msg.includes('free-models-per-day') ||
      msg.includes('daily limit') ||
      msg.includes('credits') ||
      msg.includes('quota')
    );
  }
  return false;
}
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// ─── Main scan endpoint ────────────────────────────────────────────────────────
router.post('/scan', async (req, res) => {
  const { url, email } = req.body;
  if (!url || !email) return res.status(400).json({ error: 'URL and email are required.' });

  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = 'https://' + normalizedUrl;

  try {
    // 1. PageSpeed Insights — mobile + desktop in parallel
    const psKey = process.env.PAGESPEED_API_KEY ? `&key=${process.env.PAGESPEED_API_KEY}` : '';
    const psBase = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}`;
    const [mobilePS, desktopPS] = await Promise.allSettled([
      axios.get(`${psBase}&strategy=mobile${psKey}`, { timeout: 60000 }),
      axios.get(`${psBase}&strategy=desktop${psKey}`, { timeout: 60000 }),
    ]);

    // 2. Extract speed data immediately so the big PSI payloads can be GC'd
    //    before Chrome (the memory hog) launches.
    const speed = extractSpeedData(mobilePS, desktopPS);

    // 3. Puppeteer — HTML extraction. On Render's free 512MB instance Chrome is
    //    the OOM risk, so it runs with hard low-memory flags, images/fonts/media
    //    blocked, and a fetch-based fallback if it can't run at all.
    let pageHtml = '';
    let pageTitle = '';
    let metaTags = {};
    let keyElements = {};

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
          '--single-process', '--no-zygote', '--disable-extensions', '--disable-background-networking',
          '--disable-features=site-per-process,TranslateUI', '--renderer-process-limit=1', '--mute-audio',
        ],
      });
    } catch (err) {
      console.warn(`Puppeteer launch failed (${err.message}) — falling back to plain fetch extraction`);
    }

    if (browser) try {
      const page = await browser.newPage();
      // block heavy resources — we only need the DOM
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (type === 'image' || type === 'media' || type === 'font') req.abort();
        else req.continue();
      });
      await page.setViewport({ width: 1280, height: 800 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
      // Use domcontentloaded — faster, works on slow/heavy sites
      try {
        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch {
        // If navigation times out, try to use whatever loaded so far
        console.warn('Navigation timeout — proceeding with partial page data');
      }

      try { pageTitle = await page.title(); } catch { pageTitle = ''; }
      try { pageHtml = (await page.content()).slice(0, 4000); } catch { pageHtml = ''; }

      try {
        metaTags = await page.evaluate(() => {
          const m = {};
          document.querySelectorAll('meta').forEach(el => {
            const k = el.getAttribute('name') || el.getAttribute('property');
            const v = el.getAttribute('content');
            if (k && v) m[k] = v;
          });
          return m;
        });
      } catch { metaTags = {}; }

      try {
        keyElements = await page.evaluate(() => {
          const getText = (sel) => document.querySelector(sel)?.innerText?.slice(0, 300) || null;
          const count = (sel) => document.querySelectorAll(sel).length;
          const getAll = (sel, attr) => [...document.querySelectorAll(sel)].map(el => el[attr] || el.innerText).slice(0, 10);
          return {
            h1: getText('h1'),
            h2s: getAll('h2', 'innerText'),
            ctaButtons: count('button, [class*="btn"], [class*="cta"]'),
            addToCartBtns: count('[class*="add-to-cart"], [class*="addtocart"], button[name="add"]'),
            images: count('img'),
            forms: count('form'),
            inputFields: count('input'),
            hasLiveChat: !!document.querySelector('[class*="chat"],[id*="chat"],[class*="crisp"],[class*="intercom"],[class*="tawk"]'),
            hasReviews: !!document.querySelector('[class*="review"],[class*="rating"],[class*="testimonial"],[class*="judge"]'),
            hasNewsletterForm: !!document.querySelector('input[type="email"]'),
            hasWhatsapp: !!document.querySelector('[class*="whatsapp"],[href*="wa.me"],[href*="whatsapp"]'),
            navLinks: count('nav a'),
            footerLinks: count('footer a'),
            priceElements: getAll('[class*="price"]', 'innerText'),
            hasCartIcon: !!document.querySelector('[class*="cart"],[href*="cart"]'),
            hasStickyHeader: getComputedStyle(document.querySelector('header, nav'))?.position === 'fixed',
          };
        });
      } catch { keyElements = {}; }
    } finally {
      if (browser) await browser.close().catch(() => {});
    }

    // Fallback: no Chrome (or it produced nothing) — extract what we can with plain fetch
    if (!pageHtml) {
      try {
        const res = await axios.get(normalizedUrl, {
          timeout: 25000,
          maxContentLength: 2 * 1024 * 1024,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' },
        });
        const html = String(res.data);
        pageHtml = html.slice(0, 4000);
        pageTitle = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
        metaTags = {};
        for (const m of html.matchAll(/<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']*)["']/gi)) {
          metaTags[m[1]] = m[2];
        }
        const count = (re) => (html.match(re) || []).length;
        keyElements = {
          h1: (html.match(/<h1[^>]*>([\s\S]{0,300}?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || null,
          h2s: [...html.matchAll(/<h2[^>]*>([\s\S]{0,200}?)<\/h2>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()).slice(0, 10),
          ctaButtons: count(/<button|class=["'][^"']*btn|class=["'][^"']*cta/gi),
          addToCartBtns: count(/add-to-cart|addtocart|name=["']add["']/gi),
          images: count(/<img/gi),
          forms: count(/<form/gi),
          inputFields: count(/<input/gi),
          hasLiveChat: /class=["'][^"']*chat|crisp|intercom|tawk/i.test(html),
          hasReviews: /review|rating|testimonial|judge\.me/i.test(html),
          hasNewsletterForm: /<input[^>]+type=["']email["']/i.test(html),
          hasWhatsapp: /wa\.me|whatsapp/i.test(html),
          navLinks: (html.match(/<nav[\s\S]*?<\/nav>/i)?.[0].match(/<a\s/gi) || []).length,
          footerLinks: (html.match(/<footer[\s\S]*?<\/footer>/i)?.[0].match(/<a\s/gi) || []).length,
          priceElements: [...html.matchAll(/class=["'][^"']*price[^"']*["'][^>]*>([^<]{1,40})</gi)].map((m) => m[1].trim()).slice(0, 5),
          hasCartIcon: /class=["'][^"']*cart|href=["'][^"']*cart/i.test(html),
          hasStickyHeader: null,
        };
        console.log('✓ Fallback fetch extraction succeeded');
      } catch (err) {
        console.warn(`Fallback fetch extraction failed: ${err.message} — continuing with PSI data only`);
      }
    }

    // 4. AI analysis via OpenRouter key ring
    const ai = await analyzeWithAI({ url: normalizedUrl, pageTitle, metaTags, speed, keyElements });

    // 5. Build report
    const report = { url: normalizedUrl, email, generatedAt: new Date().toISOString(), speed, ai };

    // 6. Send email (non-blocking)
    sendReportEmail(email, report).then(() => console.log('✓ Email sent')).catch(err => console.error('✗ Email failed:', err.message, err));

    res.json({ success: true, report });
  } catch (err) {
    console.error('Scan error:', err.message);
    res.status(500).json({ error: err.message || 'Scan failed. Please verify the URL and try again.' });
  }
});

// ─── Speed data extractor ──────────────────────────────────────────────────────
function extractSpeedData(mobileResult, desktopResult) {
  const parse = (result) => {
    if (result.status !== 'fulfilled') return null;
    const lh = result.value.data?.lighthouseResult;
    const cats = lh?.categories;
    const audits = lh?.audits;
    return {
      score: Math.round((cats?.performance?.score ?? 0) * 100),
      fcp: audits?.['first-contentful-paint']?.displayValue ?? 'N/A',
      lcp: audits?.['largest-contentful-paint']?.displayValue ?? 'N/A',
      tbt: audits?.['total-blocking-time']?.displayValue ?? 'N/A',
      cls: audits?.['cumulative-layout-shift']?.displayValue ?? 'N/A',
      tti: audits?.['interactive']?.displayValue ?? 'N/A',
      speedIndex: audits?.['speed-index']?.displayValue ?? 'N/A',
      accessibility: Math.round((cats?.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats?.['best-practices']?.score ?? 0) * 100),
      seoScore: Math.round((cats?.seo?.score ?? 0) * 100),
    };
  };
  return { mobile: parse(mobileResult), desktop: parse(desktopResult) };
}

// ─── Build shared prompt ───────────────────────────────────────────────────────
function buildPrompt({ url, pageTitle, metaTags, speed, keyElements }) {
  const brandName = metaTags['og:site_name']
    || pageTitle.split(/[-|–]/)[0].trim()
    || new URL(url).hostname.replace('www.', '').split('.')[0];

  return {
    brandName,
    text: `You are a D2C ecommerce CRO expert auditing the brand "${brandName}". Use "${brandName}" naturally in issues and recommendations. Return ONLY valid JSON — no markdown, no extra text.

URL: ${url}
Brand: ${brandName}
Title: ${pageTitle}
Meta Desc: ${metaTags['description'] || 'MISSING'}
Mobile Speed: ${speed.mobile?.score ?? 'N/A'}/100 | LCP: ${speed.mobile?.lcp} | CLS: ${speed.mobile?.cls} | TBT: ${speed.mobile?.tbt}
Desktop Speed: ${speed.desktop?.score ?? 'N/A'}/100
H1: ${keyElements.h1 || 'NOT FOUND'}
H2s: ${(keyElements.h2s || []).slice(0, 5).join(' | ')}
CTAs: ${keyElements.ctaButtons} | ATC: ${keyElements.addToCartBtns} | Reviews: ${keyElements.hasReviews} | Chat: ${keyElements.hasLiveChat} | Newsletter: ${keyElements.hasNewsletterForm}
Nav links: ${keyElements.navLinks} | Footer links: ${keyElements.footerLinks} | Images: ${keyElements.images} | Forms: ${keyElements.forms}
Sticky header: ${keyElements.hasStickyHeader} | Cart icon: ${keyElements.hasCartIcon} | WhatsApp: ${keyElements.hasWhatsapp}
Prices: ${JSON.stringify((keyElements.priceElements || []).slice(0, 5))}

Return this exact JSON:
{"overallScore":<0-100>,"grade":"<A+/A/B+/B/C+/C/D/F>","summary":"<3 sentence summary>","cro":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"ux":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"mobile":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"trustSignals":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"cart":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"abandonedCart":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"content":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"seo":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"accessibility":{"score":<0-100>,"headline":"<1 line>","issues":["<i1>","<i2>","<i3>"],"recommendations":["<r1>","<r2>","<r3>"]},"topPriorities":[{"priority":1,"action":"<action>","impact":"High","effort":"Low","timeframe":"<time>"},{"priority":2,"action":"<action>","impact":"High","effort":"Medium","timeframe":"<time>"},{"priority":3,"action":"<action>","impact":"Medium","effort":"Low","timeframe":"<time>"},{"priority":4,"action":"<action>","impact":"Medium","effort":"Medium","timeframe":"<time>"},{"priority":5,"action":"<action>","impact":"Medium","effort":"High","timeframe":"<time>"}]}`
  };
}

function parseJSON(text) {
  const cleaned = text.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    // some models wrap the JSON in prose — salvage the outermost object
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error('no JSON object in response');
  }
}

// ─── Gemini 2.0 Flash (primary) ───────────────────────────────────────────────
async function tryGemini(prompt) {
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean);
  if (!keys.length) throw new Error('No Gemini key');

  let lastError = '';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`Trying Gemini 2.0 Flash (key ${i + 1})…`);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        lastError = `Gemini key ${i + 1} error: ${data?.error?.message}`;
        console.warn(lastError);
        continue;
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) { lastError = `Gemini key ${i + 1} returned empty`; continue; }
      return parseJSON(text);
    } catch (err) {
      lastError = err.message;
      console.warn(`Gemini key ${i + 1} failed: ${err.message}`);
    }
  }
  throw new Error(lastError || 'All Gemini keys failed');
}

// ─── OpenRouter: key ring × best-first model ladder ────────────────────────────
// For each key, walk the 14-model ladder top-down. A model failure (bad model,
// 5xx, timeout, empty or unparseable response, upstream 429) advances to the
// next model on the SAME key. A key-level failure (401/402/403, daily free
// quota) cools that key down and switches to the next key — restarting the
// ladder from the best model.
async function tryOpenRouter(prompt) {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const allKeys = OPENROUTER_KEYS();
  if (!allKeys.length) throw new Error('No OpenRouter API keys configured');

  const now = Date.now();
  const fresh = allKeys.filter((k) => (keyExhaustedUntil.get(k) || 0) < now);
  const ring = fresh.length ? fresh : allKeys; // if everything is cooling down, try anyway

  let lastError = '';
  for (let k = 0; k < ring.length; k++) {
    const key = ring[k];
    const keyLabel = `key ${k + 1}/${ring.length} (…${key.slice(-4)})`;

    modelLoop:
    for (let i = 0; i < OPENROUTER_MODELS.length; i++) {
      const model = OPENROUTER_MODELS[i];
      if (i > 0) await sleep(1500);
      console.log(`OpenRouter ${keyLabel} → model ${i + 1}/${OPENROUTER_MODELS.length}: ${model}`);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 90000);
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://ascentdelta.vercel.app',
            'X-Title': 'AscentDelta AI Scan',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
          }),
        });
        const result = await res.json();

        if (!res.ok) {
          const msg = result?.error?.message || `HTTP ${res.status}`;
          lastError = `${model}: ${msg}`;
          if (isKeyLevelError(res.status, msg)) {
            keyExhaustedUntil.set(key, Date.now() + KEY_COOLDOWN_MS);
            console.warn(`${keyLabel} exhausted (${res.status}): ${msg} — switching key, restarting ladder`);
            break modelLoop;
          }
          console.warn(`${model} failed (${res.status}): ${msg} — next model`);
          continue;
        }

        const content = result?.choices?.[0]?.message?.content;
        if (!content) {
          lastError = `${model}: empty response`;
          console.warn(`${lastError} — next model`);
          continue;
        }

        const parsed = parseJSON(content); // throws → treated as model failure below
        console.log(`✓ OpenRouter succeeded: ${model} on ${keyLabel}`);
        return parsed;
      } catch (err) {
        lastError = `${model}: ${err.name === 'AbortError' ? 'timed out after 90s' : err.message}`;
        console.warn(`${lastError} — next model`);
      } finally {
        clearTimeout(timer);
      }
    }
  }
  throw new Error(`All OpenRouter keys and models failed. Last: ${lastError}`);
}

// ─── Main AI analysis entry point ─────────────────────────────────────────────
async function analyzeWithAI(data) {
  const { text: prompt } = buildPrompt(data);

  // 1. OpenRouter key ring × model ladder (primary)
  try {
    return await tryOpenRouter(prompt);
  } catch (err) {
    console.warn(`OpenRouter chain failed: ${err.message} — falling back to Gemini…`);
  }

  // 2. Gemini as the final safety net
  const result = await tryGemini(prompt);
  console.log('✓ Gemini succeeded');
  return result;
}

// exported for smoke tests only
export const __testables = { tryOpenRouter, parseJSON, OPENROUTER_KEYS, OPENROUTER_MODELS };

// ─── Email report ──────────────────────────────────────────────────────────────
async function sendReportEmail(email, report) {
  const { ai, url, speed } = report;
  const scoreColor = (s) => s >= 80 ? '#16a34a' : s >= 60 ? '#d97706' : '#dc2626';
  const badge = (s) => `<span style="background:${scoreColor(s)};color:#fff;border-radius:20px;padding:3px 12px;font-size:13px;font-weight:700;">${s}/100</span>`;

  const sections = [
    ['CRO',             ai.cro],
    ['UX & Design',     ai.ux],
    ['Mobile',          ai.mobile],
    ['Trust Signals',   ai.trustSignals],
    ['Cart & Checkout', ai.cart],
    ['Abandoned Cart',  ai.abandonedCart],
    ['Content & Copy',  ai.content],
    ['SEO',             ai.seo],
    ['Accessibility',   ai.accessibility],
  ];

  await getResend().emails.send({
    from: 'AI Scan by AscentDelta <onboarding@resend.dev>',
    to: ['ascentxdelta@gmail.com'],
    subject: `[AI Scan] ${url} — Score: ${ai.overallScore}/100 (requested by ${email})`,
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;background:#fff;color:#111;">
  <div style="background:#000;padding:32px;text-align:center;">
    <h1 style="color:#fff;font-size:22px;margin:0;font-weight:700;">Website Audit Report</h1>
    <p style="color:#14b5bc;margin:8px 0 0;font-size:14px;">${url}</p>
  </div>
  <div style="padding:32px;">
    <div style="text-align:center;background:#f9f9f9;border-radius:16px;padding:28px;margin-bottom:28px;">
      <div style="font-size:72px;font-weight:800;color:#14b5bc;line-height:1;">${ai.overallScore}</div>
      <div style="font-size:18px;color:#666;margin-top:4px;">Overall Score / 100 &nbsp;|&nbsp; Grade: <strong>${ai.grade}</strong></div>
      <p style="color:#444;margin:16px 0 0;font-size:14px;line-height:1.6;">${ai.summary}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:10px 14px;text-align:left;font-size:12px;color:#666;font-weight:600;text-transform:uppercase;">Section</th>
        <th style="padding:10px 14px;text-align:left;font-size:12px;color:#666;font-weight:600;text-transform:uppercase;">Assessment</th>
        <th style="padding:10px 14px;text-align:right;font-size:12px;color:#666;font-weight:600;text-transform:uppercase;">Score</th>
      </tr>
      ${sections.map(([label, s]) => `
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:12px 14px;font-weight:600;font-size:14px;">${label}</td>
        <td style="padding:12px 14px;color:#555;font-size:13px;">${s?.headline || ''}</td>
        <td style="padding:12px 14px;text-align:right;">${badge(s?.score ?? 0)}</td>
      </tr>`).join('')}
    </table>
    <div style="background:#000;border-radius:12px;padding:24px;margin-bottom:28px;">
      <h2 style="color:#fff;font-size:16px;margin:0 0 16px;font-weight:700;">Top 5 Priority Actions</h2>
      ${(ai.topPriorities || []).map(p => `
      <div style="border-left:3px solid #14b5bc;padding:10px 16px;margin-bottom:10px;background:rgba(255,255,255,0.05);border-radius:0 8px 8px 0;">
        <div style="color:#fff;font-size:14px;font-weight:600;">#${p.priority} — ${p.action}</div>
        <div style="color:#14b5bc;font-size:12px;margin-top:4px;">Impact: ${p.impact} · Effort: ${p.effort} · ${p.timeframe}</div>
      </div>`).join('')}
    </div>
    ${speed.mobile ? `
    <div style="background:#f9f9f9;border-radius:12px;padding:20px;">
      <h2 style="font-size:15px;font-weight:700;margin:0 0 14px;">Page Speed — Mobile</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          ${[['Performance', speed.mobile.score + '/100'], ['LCP', speed.mobile.lcp], ['CLS', speed.mobile.cls], ['TBT', speed.mobile.tbt]].map(([k,v]) =>
            `<td style="text-align:center;padding:10px;background:#fff;border-radius:8px;margin:4px;">
              <div style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">${k}</div>
              <div style="font-size:18px;font-weight:700;color:#111;">${v}</div>
            </td>`).join('')}
        </tr>
      </table>
    </div>` : ''}
    <p style="font-size:12px;color:#aaa;text-align:center;margin-top:32px;">
      Generated by <strong style="color:#14b5bc;">AscentDelta AI Scan</strong> · <a href="https://ascentdelta.vercel.app" style="color:#14b5bc;text-decoration:none;">ascentdelta.vercel.app</a>
    </p>
  </div>
</div>`,
  });
}

export default router;
