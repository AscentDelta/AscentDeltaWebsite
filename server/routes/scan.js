import { Router } from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { Resend } from 'resend';

const router = Router();

const OPENROUTER_KEY = () => process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODELS = [
  'deepseek/deepseek-v4-flash:free',
  'google/gemma-3-27b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-235b-a22b:free',
  'qwen/qwen3-8b:free',
  'microsoft/phi-4:free',
  'google/gemma-3-12b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-3n-e4b-it:free',
];
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

    // 2. Puppeteer — HTML extraction (no screenshot needed for DeepSeek)
    let pageHtml = '';
    let pageTitle = '';
    let metaTags = {};
    let keyElements = {};

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
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
      await browser.close();
    }

    // 3. Extract speed data
    const speed = extractSpeedData(mobilePS, desktopPS);

    // 4. DeepSeek AI analysis via OpenRouter
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
  return JSON.parse(cleaned);
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

// ─── OpenRouter fallback chain ─────────────────────────────────────────────────
async function tryOpenRouter(prompt) {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  let lastError = '';

  for (let i = 0; i < OPENROUTER_MODELS.length; i++) {
    const model = OPENROUTER_MODELS[i];
    if (i > 0) await sleep(4000);
    try {
      console.log(`Trying OpenRouter model: ${model}`);
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://go100days.com',
          'X-Title': '100Days AI Scan',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        const code = result?.error?.code;
        lastError = result?.error?.message || 'Unavailable';
        console.warn(`${model} skipped (${code}): ${lastError}`);
        continue;
      }

      return parseJSON(result.choices[0].message.content);
    } catch (err) {
      if (err.message.includes('JSON')) throw err;
      lastError = err.message;
      console.warn(`${model} failed: ${err.message}`);
    }
  }
  throw new Error(`All OpenRouter models failed. Last: ${lastError}`);
}

// ─── Main AI analysis entry point ─────────────────────────────────────────────
async function analyzeWithAI(data) {
  const { text: prompt } = buildPrompt(data);

  // 1. Try Gemini first
  try {
    const result = await tryGemini(prompt);
    console.log('✓ Gemini succeeded');
    return result;
  } catch (err) {
    console.warn(`Gemini failed: ${err.message} — falling back to OpenRouter…`);
  }

  // 2. Fall back to OpenRouter models
  return tryOpenRouter(prompt);
}

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
    from: 'AI Scan by 100Days <onboarding@resend.dev>',
    to: ['info@go100days.com', 'data@go100days.com'],
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
      Generated by <strong style="color:#14b5bc;">100Days AI Scan</strong> · <a href="https://go100days.com" style="color:#14b5bc;text-decoration:none;">go100days.com</a>
    </p>
  </div>
</div>`,
  });
}

export default router;
