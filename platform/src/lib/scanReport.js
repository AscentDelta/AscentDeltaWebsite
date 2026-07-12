// Generates the AI Scan audit report as a fully branded .pptx, client-side.

const C = {
  bg: '0A1220',
  card: '101E31',
  cardHi: '132539',
  line: '24405C',
  lineHi: '2E5273',
  teal: '1FD4C4',
  tealCore: '14B8AB',
  white: 'FFFFFF',
  body: 'C9D7E5',
  muted: '8CA3B8',
  faint: '627E96',
  green: '4ADE80',
  amber: 'FACC15',
  red: 'F87171',
};
const HEAD = 'Arial';
const BODY = 'Calibri';
const W = 13.333;

const SITE = 'https://ascentdelta.vercel.app';
const EMAIL = 'ascentxdelta@gmail.com';
const PHONE_DISPLAY = '+91 81468 30484';

const SECTIONS = [
  ['cro', 'Conversion Rate Optimisation'],
  ['ux', 'UX & Design'],
  ['mobile', 'Mobile Experience'],
  ['trustSignals', 'Trust Signals'],
  ['cart', 'Cart & Checkout'],
  ['abandonedCart', 'Abandoned Cart Recovery'],
  ['content', 'Content & Copy'],
  ['seo', 'SEO Fundamentals'],
  ['accessibility', 'Accessibility'],
];

const scoreColor = (s) => (s >= 80 ? C.green : s >= 60 ? C.amber : C.red);

async function fetchLogoDataUrl() {
  try {
    const res = await fetch('/logo-mark.png');
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateScanReport(report) {
  const { default: pptxgen } = await import('pptxgenjs');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'AscentDelta';
  pres.company = 'AscentDelta';
  pres.title = 'AscentDelta — AI Scan Audit Report';

  pres.defineSlideMaster({ title: 'DARK', background: { color: C.bg } });

  const logo = await fetchLogoDataUrl();
  const { ai, speed, url } = report;
  const host = (() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url; } })();
  const dateStr = new Date(report.generatedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const gradeCol = scoreColor(ai.overallScore);

  const card = (s, x, y, w, h, o = {}) =>
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09, fill: { color: o.fill || C.card }, line: { color: o.line || C.line, width: 1 } });

  const brandHeader = (s, sub) => {
    if (logo) s.addImage({ data: logo, x: 0.6, y: 0.42, w: 0.42, h: 0.42 });
    s.addText([
      { text: 'ASCENT', options: { color: C.white } },
      { text: 'DELTA', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 14, bold: true, charSpacing: 2, ...r.options } })), {
      x: logo ? 1.12 : 0.6, y: 0.42, w: 3.2, h: 0.42, margin: 0, valign: 'middle',
    });
    s.addText(`${host}  ·  ${dateStr}`, { x: 8.5, y: 0.42, w: 4.23, h: 0.42, align: 'right', fontFace: BODY, fontSize: 10, color: C.faint, margin: 0, valign: 'middle' });
    if (sub) s.addText(sub.toUpperCase(), { x: 0.6, y: 1.02, w: 12, h: 0.26, fontFace: HEAD, fontSize: 10.5, bold: true, color: C.teal, charSpacing: 3, margin: 0 });
  };

  const contactFooter = (s) => {
    s.addText([
      { text: 'ascentdelta.vercel.app', options: { hyperlink: { url: SITE }, color: C.teal } },
      { text: '   ·   ', options: { color: C.faint } },
      { text: EMAIL, options: { hyperlink: { url: `mailto:${EMAIL}` }, color: C.teal } },
      { text: '   ·   ', options: { color: C.faint } },
      { text: PHONE_DISPLAY, options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: BODY, fontSize: 9.5, ...r.options } })), {
      x: 0.6, y: 7.05, w: 12.13, h: 0.26, align: 'center', margin: 0, valign: 'middle',
    });
  };

  // ---------- SLIDE 1 — cover ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    if (logo) s.addImage({ data: logo, x: W / 2 - 0.4, y: 0.7, w: 0.8, h: 0.8 });
    s.addText([
      { text: 'ASCENT', options: { color: C.white } },
      { text: 'DELTA', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 18, bold: true, charSpacing: 3, ...r.options } })), {
      x: 0.6, y: 1.65, w: 12.13, h: 0.4, align: 'center', margin: 0,
    });
    s.addText('AI SCAN — WEBSITE AUDIT REPORT', {
      x: 0.6, y: 2.2, w: 12.13, h: 0.32, align: 'center', fontFace: HEAD, fontSize: 12.5, bold: true, color: C.teal, charSpacing: 5, margin: 0,
    });
    s.addText(url, { x: 0.6, y: 2.62, w: 12.13, h: 0.3, align: 'center', fontFace: BODY, fontSize: 13, color: C.muted, margin: 0 });

    // score badge
    s.addShape(pres.ShapeType.roundRect, { x: W / 2 - 1.05, y: 3.1, w: 2.1, h: 1.75, rectRadius: 0.2, fill: { color: C.card }, line: { color: gradeCol, width: 2.5 } });
    s.addText(String(ai.overallScore), { x: W / 2 - 1.05, y: 3.18, w: 2.1, h: 1.05, align: 'center', valign: 'middle', fontFace: HEAD, fontSize: 48, bold: true, color: gradeCol, margin: 0 });
    s.addText(`/ 100   ·   GRADE ${ai.grade}`, { x: W / 2 - 1.05, y: 4.3, w: 2.1, h: 0.35, align: 'center', fontFace: HEAD, fontSize: 11, bold: true, color: C.muted, charSpacing: 2, margin: 0 });

    s.addText(ai.summary, {
      x: 1.9, y: 5.15, w: 9.53, h: 1.15, align: 'center', fontFace: BODY, fontSize: 12.5, color: C.body, margin: 0, lineSpacing: 17, valign: 'top',
    });
    s.addText(`Generated ${dateStr} · AscentDelta AI Scan`, {
      x: 0.6, y: 6.4, w: 12.13, h: 0.28, align: 'center', fontFace: BODY, italic: true, fontSize: 10, color: C.faint, margin: 0,
    });
    contactFooter(s);
  }

  // ---------- SLIDE 2 — scorecard ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s, 'Scorecard');
    s.addText('Nine dimensions, one verdict', { x: 0.6, y: 1.32, w: 12, h: 0.5, fontFace: HEAD, fontSize: 24, bold: true, color: C.white, margin: 0 });

    const rowH = 0.52, y0 = 2.05;
    SECTIONS.forEach(([key, label], i) => {
      const d = ai[key] || {};
      const y = y0 + i * rowH;
      if (i % 2 === 0) s.addShape(pres.ShapeType.rect, { x: 0.6, y, w: 12.13, h: rowH, fill: { color: C.card }, line: { type: 'none' } });
      s.addText(label, { x: 0.85, y, w: 3.4, h: rowH, fontFace: HEAD, fontSize: 11.5, bold: true, color: C.white, margin: 0, valign: 'middle' });
      s.addText(d.headline || '—', { x: 4.35, y, w: 6.6, h: rowH, fontFace: BODY, fontSize: 10.5, color: C.muted, margin: 0, valign: 'middle' });
      const col = scoreColor(d.score ?? 0);
      s.addShape(pres.ShapeType.roundRect, { x: 11.35, y: y + 0.08, w: 1.05, h: rowH - 0.16, rectRadius: 0.18, fill: { color: C.cardHi }, line: { color: col, width: 1.25 } });
      s.addText(`${d.score ?? 0}`, { x: 11.35, y: y + 0.08, w: 1.05, h: rowH - 0.16, align: 'center', valign: 'middle', fontFace: HEAD, fontSize: 12, bold: true, color: col, margin: 0 });
    });
    contactFooter(s);
  }

  // ---------- SLIDE 3 — page speed ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s, 'Performance');
    s.addText('Page speed — Google Lighthouse', { x: 0.6, y: 1.32, w: 12, h: 0.5, fontFace: HEAD, fontSize: 24, bold: true, color: C.white, margin: 0 });

    const drawDevice = (x, title, d) => {
      card(s, x, 2.0, 5.95, 4.3);
      s.addText(title, { x: x + 0.3, y: 2.25, w: 5.3, h: 0.35, fontFace: HEAD, fontSize: 14, bold: true, color: C.white, margin: 0 });
      if (!d) {
        s.addText('Not captured on this run — re-run the scan for this device.', { x: x + 0.3, y: 3.6, w: 5.35, h: 0.6, fontFace: BODY, italic: true, fontSize: 11, color: C.faint, margin: 0, align: 'center' });
        return;
      }
      const col = scoreColor(d.score);
      s.addText(String(d.score), { x: x + 0.3, y: 2.7, w: 1.9, h: 0.9, fontFace: HEAD, fontSize: 44, bold: true, color: col, margin: 0 });
      s.addText('performance / 100', { x: x + 0.32, y: 3.62, w: 1.9, h: 0.3, fontFace: BODY, fontSize: 9.5, color: C.muted, margin: 0 });
      const metrics = [
        ['FCP', d.fcp], ['LCP', d.lcp], ['TBT', d.tbt],
        ['CLS', d.cls], ['TTI', d.tti], ['Speed Index', d.speedIndex],
      ];
      metrics.forEach(([k, v], i) => {
        const mx = x + 2.45 + (i % 2) * 1.75, my = 2.72 + Math.floor(i / 2) * 0.78;
        s.addText(k.toUpperCase(), { x: mx, y: my, w: 1.65, h: 0.22, fontFace: HEAD, fontSize: 8.5, bold: true, color: C.faint, charSpacing: 1.5, margin: 0 });
        s.addText(String(v ?? 'N/A'), { x: mx, y: my + 0.22, w: 1.65, h: 0.34, fontFace: HEAD, fontSize: 14, bold: true, color: C.body, margin: 0 });
      });
      s.addText('LCP is the number that moves revenue — every second past 2.5s costs conversions.', {
        x: x + 0.3, y: 5.55, w: 5.35, h: 0.55, fontFace: BODY, italic: true, fontSize: 9.5, color: C.faint, margin: 0, lineSpacing: 12,
      });
    };
    drawDevice(0.6, '📱  Mobile (most of your traffic)', speed?.mobile);
    drawDevice(6.78, '🖥  Desktop', speed?.desktop);
    contactFooter(s);
  }

  // ---------- SLIDES 4-8 — section details (2 per slide) ----------
  const drawSection = (s, y, key, label) => {
    const d = ai[key] || {};
    const col = scoreColor(d.score ?? 0);
    card(s, 0.6, y, 12.13, 2.5);
    // header row
    s.addShape(pres.ShapeType.roundRect, { x: 0.88, y: y + 0.22, w: 0.9, h: 0.44, rectRadius: 0.12, fill: { color: C.cardHi }, line: { color: col, width: 1.25 } });
    s.addText(`${d.score ?? 0}`, { x: 0.88, y: y + 0.22, w: 0.9, h: 0.44, align: 'center', valign: 'middle', fontFace: HEAD, fontSize: 13, bold: true, color: col, margin: 0 });
    s.addText([
      { text: `${label}   `, options: { color: C.white, bold: true, fontSize: 14, fontFace: HEAD } },
      { text: d.headline || '', options: { color: C.muted, fontSize: 10.5, fontFace: BODY } },
    ], { x: 1.95, y: y + 0.22, w: 10.5, h: 0.44, margin: 0, valign: 'middle' });

    const half = 5.75;
    s.addText('ISSUES FOUND', { x: 0.88, y: y + 0.82, w: half, h: 0.24, fontFace: HEAD, fontSize: 9, bold: true, color: C.red, charSpacing: 2, margin: 0 });
    s.addText((d.issues || []).map((t, i, a) => ({
      text: t,
      options: { bullet: { code: '2715', indent: 10 }, breakLine: i < a.length - 1, paraSpaceAfter: 5, color: C.body, fontFace: BODY, fontSize: 9.5 },
    })), { x: 0.88, y: y + 1.08, w: half, h: 1.3, margin: 0, valign: 'top', lineSpacing: 11.5 });

    s.addText('RECOMMENDATIONS', { x: 6.9, y: y + 0.82, w: half, h: 0.24, fontFace: HEAD, fontSize: 9, bold: true, color: C.teal, charSpacing: 2, margin: 0 });
    s.addText((d.recommendations || []).map((t, i, a) => ({
      text: t,
      options: { bullet: { code: '2713', indent: 10 }, breakLine: i < a.length - 1, paraSpaceAfter: 5, color: C.body, fontFace: BODY, fontSize: 9.5 },
    })), { x: 6.9, y: y + 1.08, w: half, h: 1.3, margin: 0, valign: 'top', lineSpacing: 11.5 });
  };

  for (let i = 0; i < SECTIONS.length; i += 2) {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s, `Deep dive ${Math.floor(i / 2) + 1} of ${Math.ceil(SECTIONS.length / 2)}`);
    s.addText('What we found — and what to do about it', { x: 0.6, y: 1.32, w: 12, h: 0.45, fontFace: HEAD, fontSize: 20, bold: true, color: C.white, margin: 0 });
    drawSection(s, 1.95, SECTIONS[i][0], SECTIONS[i][1]);
    if (SECTIONS[i + 1]) drawSection(s, 4.6, SECTIONS[i + 1][0], SECTIONS[i + 1][1]);
    contactFooter(s);
  }

  // ---------- SLIDE 9 — top priorities ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s, 'Action plan');
    s.addText([
      { text: 'Top 5 priorities — ', options: { color: C.white } },
      { text: 'in order', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 24, bold: true, ...r.options } })), { x: 0.6, y: 1.32, w: 12, h: 0.5, margin: 0 });

    (ai.topPriorities || []).slice(0, 5).forEach((p, i) => {
      const y = 2.05 + i * 0.94;
      card(s, 0.6, y, 12.13, 0.82, { fill: i === 0 ? C.cardHi : C.card, line: i === 0 ? C.lineHi : C.line });
      s.addText(`0${p.priority || i + 1}`, { x: 0.9, y, w: 0.75, h: 0.82, fontFace: HEAD, fontSize: 22, bold: true, color: C.teal, margin: 0, valign: 'middle' });
      s.addText(p.action || '', { x: 1.75, y, w: 7.6, h: 0.82, fontFace: BODY, fontSize: 12, color: C.white, margin: 0, valign: 'middle', lineSpacing: 14 });
      s.addText([
        { text: `${p.impact || '—'} impact`, options: { color: C.teal, bold: true } },
        { text: `  ·  ${p.effort || '—'} effort  ·  ${p.timeframe || ''}`, options: { color: C.muted } },
      ].map((r) => ({ text: r.text, options: { fontFace: BODY, fontSize: 10, ...r.options } })), {
        x: 9.45, y, w: 3.05, h: 0.82, align: 'right', margin: 0, valign: 'middle',
      });
    });
    contactFooter(s);
  }

  // ---------- SLIDE 10 — CTA ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    if (logo) s.addImage({ data: logo, x: W / 2 - 0.4, y: 1.15, w: 0.8, h: 0.8 });
    s.addText([
      { text: 'Want these fixed in ', options: { color: C.white } },
      { text: '3 months?', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 34, bold: true, ...r.options } })), {
      x: 0.6, y: 2.35, w: 12.13, h: 0.7, align: 'center', margin: 0,
    });
    s.addText('This scan is the diagnosis. We\'re the operators who do the surgery — CRO, speed, trust,\nretention and paid growth, run as one accountable P&L.', {
      x: 1.6, y: 3.3, w: 10.13, h: 0.85, align: 'center', fontFace: BODY, fontSize: 14, color: C.body, margin: 0, lineSpacing: 20,
    });
    const buttons = [
      { label: 'ascentdelta.vercel.app', url: SITE },
      { label: EMAIL, url: `mailto:${EMAIL}` },
      { label: PHONE_DISPLAY, url: null },
    ];
    const bw = 3.6, gap = 0.35;
    const totalW = buttons.length * bw + (buttons.length - 1) * gap;
    buttons.forEach((b, i) => {
      const x = (W - totalW) / 2 + i * (bw + gap);
      s.addShape(pres.ShapeType.roundRect, { x, y: 4.55, w: bw, h: 0.62, rectRadius: 0.31, fill: { color: C.card }, line: { color: C.tealCore, width: 1.25 } });
      s.addText([
        { text: b.label, options: b.url ? { hyperlink: { url: b.url } } : {} },
      ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 12.5, bold: true, color: C.teal, ...r.options } })), {
        x, y: 4.55, w: bw, h: 0.62, align: 'center', valign: 'middle', margin: 0,
      });
    });
    s.addText([
      { text: 'Grade your unit economics too → ', options: { color: C.muted } },
      { text: 'ascentdelta.vercel.app/growth-engine', options: { hyperlink: { url: `${SITE}/growth-engine` }, color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: BODY, italic: true, fontSize: 11, ...r.options } })), {
      x: 0.6, y: 5.65, w: 12.13, h: 0.3, align: 'center', margin: 0,
    });
    s.addText([
      { text: 'ASCENT', options: { color: C.white } },
      { text: 'DELTA', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 13, bold: true, charSpacing: 3, ...r.options } })), {
      x: 0.6, y: 6.7, w: 12.13, h: 0.35, align: 'center', margin: 0,
    });
  }

  const blob = await pres.write({ outputType: 'blob' });
  const fileName = `AscentDelta-AI-Scan-${host.replace(/[^a-z0-9.-]/gi, '')}-${ai.overallScore}.pptx`;
  return { blob, fileName };
}
