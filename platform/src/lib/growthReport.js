// Generates the personalised Growth Engine report as a branded .pptx, fully client-side.

const C = {
  bg: '0A1220',
  card: '101E31',
  cardHi: '132539',
  line: '24405C',
  lineHi: '2E5273',
  teal: '1FD4C4',
  tealCore: '14B8AB',
  blue: '2F7FC0',
  white: 'FFFFFF',
  body: 'C9D7E5',
  muted: '8CA3B8',
  faint: '627E96',
  red: 'F87171',
};
const HEAD = 'Arial';
const BODY = 'Calibri';
const W = 13.333;

const SITE = 'https://ascentdelta.com';
const EMAIL = 'ascentxdelta@gmail.com';
const PHONE_DISPLAY = '+91 81468 30484';

const fmtINR = (v) => {
  const n = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  if (n >= 1e7) return `${sign}₹${(n / 1e7).toFixed(n >= 1e8 ? 0 : 2)} Cr`;
  if (n >= 1e5) return `${sign}₹${(n / 1e5).toFixed(n >= 1e6 ? 0 : 1)} L`;
  return `${sign}₹${Math.round(n).toLocaleString('en-IN')}`;
};

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

function contactFooter(slide, pres) {
  slide.addText([
    { text: 'ascentdelta.com', options: { hyperlink: { url: SITE }, color: C.teal } },
    { text: '   ·   ', options: { color: C.faint } },
    { text: EMAIL, options: { hyperlink: { url: `mailto:${EMAIL}` }, color: C.teal } },
    { text: '   ·   ', options: { color: C.faint } },
    { text: PHONE_DISPLAY, options: { color: C.teal } },
  ].map((r) => ({ text: r.text, options: { fontFace: BODY, fontSize: 9.5, ...r.options } })), {
    x: 0.6, y: 7.05, w: 12.13, h: 0.26, align: 'center', margin: 0, valign: 'middle',
  });
}

function card(pres, slide, x, y, w, h, { fill = C.card, line = C.line } = {}) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { color: line, width: 1 } });
}

export async function generateGrowthReport({ inputs, m, gradeColorHex }) {
  const { default: pptxgen } = await import('pptxgenjs');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'AscentDelta';
  pres.company = 'AscentDelta';
  pres.title = 'AscentDelta — Growth Engine Report';

  pres.defineSlideMaster({ title: 'DARK', background: { color: C.bg } });

  const logo = await fetchLogoDataUrl();
  const gradeColor = (gradeColorHex || '#1fd4c4').replace('#', '').toUpperCase();
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const brandHeader = (slide) => {
    if (logo) slide.addImage({ data: logo, x: 0.6, y: 0.42, w: 0.42, h: 0.42 });
    slide.addText([
      { text: 'ASCENT', options: { color: C.white } },
      { text: 'DELTA', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 14, bold: true, charSpacing: 2, ...r.options } })), {
      x: logo ? 1.12 : 0.6, y: 0.42, w: 3.2, h: 0.42, margin: 0, valign: 'middle',
    });
  };

  // ---------- SLIDE 1 — cover ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    if (logo) s.addImage({ data: logo, x: W / 2 - 0.45, y: 0.85, w: 0.9, h: 0.9 });
    s.addText([
      { text: 'ASCENT', options: { color: C.white } },
      { text: 'DELTA', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 20, bold: true, charSpacing: 3, ...r.options } })), {
      x: 0.6, y: 1.95, w: 12.13, h: 0.45, align: 'center', margin: 0,
    });

    s.addText('GROWTH ENGINE REPORT', {
      x: 0.6, y: 2.65, w: 12.13, h: 0.35, align: 'center', fontFace: HEAD, fontSize: 13, bold: true, color: C.teal, charSpacing: 5, margin: 0,
    });

    // grade badge
    s.addShape(pres.ShapeType.roundRect, { x: W / 2 - 0.85, y: 3.25, w: 1.7, h: 1.7, rectRadius: 0.22, fill: { color: C.card }, line: { color: gradeColor, width: 2.5 } });
    s.addText(m.grade, { x: W / 2 - 0.85, y: 3.25, w: 1.7, h: 1.7, align: 'center', valign: 'middle', fontFace: HEAD, fontSize: 60, bold: true, color: gradeColor, margin: 0 });

    s.addText(m.verdict, { x: 0.6, y: 5.25, w: 12.13, h: 0.5, align: 'center', fontFace: HEAD, fontSize: 24, bold: true, color: C.white, margin: 0 });
    s.addText(`Generated ${dateStr} · from your numbers on the AscentDelta Growth Engine`, {
      x: 0.6, y: 5.85, w: 12.13, h: 0.3, align: 'center', fontFace: BODY, fontSize: 11.5, color: C.muted, margin: 0,
    });
    contactFooter(s, pres);
  }

  // ---------- SLIDE 2 — your economics ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s);
    s.addText('Your economics today', { x: 0.6, y: 1.05, w: 12, h: 0.55, fontFace: HEAD, fontSize: 26, bold: true, color: C.white, margin: 0 });

    // inputs card
    card(pres, s, 0.6, 1.85, 5.9, 4.5);
    s.addText('WHAT YOU TOLD US', { x: 0.9, y: 2.12, w: 5.3, h: 0.3, fontFace: HEAD, fontSize: 10.5, bold: true, color: C.teal, charSpacing: 3, margin: 0 });
    const rows = [
      ['Monthly revenue', fmtINR(inputs.rev)],
      ['Average order value', `₹${Math.round(inputs.aov).toLocaleString('en-IN')}`],
      ['Blended ROAS', `${inputs.roas.toFixed(1)}x`],
      ['COGS', `${inputs.cogs}%`],
      ['Shipping + RTO', `${inputs.ship}%`],
      ['Payment fees + packaging', `${inputs.fees}%`],
    ];
    rows.forEach(([k, v], i) => {
      const y = 2.55 + i * 0.62;
      s.addText(k, { x: 0.9, y, w: 3.4, h: 0.4, fontFace: BODY, fontSize: 12, color: C.muted, margin: 0, valign: 'middle' });
      s.addText(v, { x: 4.3, y, w: 1.9, h: 0.4, align: 'right', fontFace: HEAD, fontSize: 13, bold: true, color: C.white, margin: 0, valign: 'middle' });
      if (i < rows.length - 1) s.addShape(pres.ShapeType.line, { x: 0.9, y: y + 0.5, w: 5.3, h: 0, line: { color: C.line, width: 0.5 } });
    });

    // computed card
    card(pres, s, 6.75, 1.85, 5.98, 4.5, { fill: C.cardHi, line: C.lineHi });
    s.addText('WHAT THE MATH SAYS', { x: 7.05, y: 2.12, w: 5.3, h: 0.3, fontFace: HEAD, fontSize: 10.5, bold: true, color: C.teal, charSpacing: 3, margin: 0 });
    const stats = [
      ['Contribution margin', `${Math.round(m.cmPct)}%`, C.white],
      ['Contribution per order', fmtINR(m.cmPerOrder), C.white],
      ['Break-even ROAS', `${m.beRoas.toFixed(1)}x`, C.white],
      ['Your blended ROAS', `${inputs.roas.toFixed(1)}x`, m.gapRatio >= 1 ? C.teal : C.red],
      ['Monthly ad spend', fmtINR(m.adSpend), C.white],
      ['Monthly profit after ads', fmtINR(m.contribution), m.contribution >= 0 ? C.teal : C.red],
    ];
    stats.forEach(([k, v, color], i) => {
      const y = 2.55 + i * 0.62;
      s.addText(k, { x: 7.05, y, w: 3.5, h: 0.4, fontFace: BODY, fontSize: 12, color: C.muted, margin: 0, valign: 'middle' });
      s.addText(v, { x: 10.55, y, w: 1.9, h: 0.4, align: 'right', fontFace: HEAD, fontSize: 13, bold: true, color, margin: 0, valign: 'middle' });
      if (i < stats.length - 1) s.addShape(pres.ShapeType.line, { x: 7.05, y: y + 0.5, w: 5.4, h: 0, line: { color: C.lineHi, width: 0.5 } });
    });

    card(pres, s, 0.6, 6.5, 12.13, 0.42, { fill: C.card, line: C.line });
    s.addText([
      { text: `${m.grade} — ${m.verdict}.  `, options: { color: gradeColor, bold: true } },
      { text: m.verdictSub, options: { color: C.body } },
    ].map((r) => ({ text: r.text, options: { fontFace: BODY, fontSize: 10, ...r.options } })), {
      x: 0.85, y: 6.5, w: 11.6, h: 0.42, margin: 0, valign: 'middle',
    });
  }

  // ---------- SLIDE 3 — the next 3 months ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s);
    s.addText('The next 3 months', { x: 0.6, y: 1.05, w: 12, h: 0.55, fontFace: HEAD, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText('Efficiency-led plan at your current ad spend — fix conversion and retention first, then scale what converts.', {
      x: 0.6, y: 1.62, w: 11.9, h: 0.35, fontFace: BODY, fontSize: 12.5, color: C.muted, margin: 0,
    });

    const monthly = (a, b) => {
      let sum = 0;
      for (let d = a; d <= b; d++) sum += m.mult(d);
      return (m.daily * sum);
    };
    const base = inputs.rev;
    const m1 = monthly(1, 30), m2 = monthly(31, 60), m3 = monthly(61, 90);

    s.addChart(pres.ChartType.line, [
      { name: 'Today’s run-rate', labels: ['Month 1', 'Month 2', 'Month 3'], values: [base, base, base] },
      { name: 'AscentDelta plan', labels: ['Month 1', 'Month 2', 'Month 3'], values: [Math.round(m1), Math.round(m2), Math.round(m3)] },
    ], {
      x: 0.6, y: 2.2, w: 7.6, h: 4.1,
      chartColors: ['627E96', '1FD4C4'],
      lineSize: 3, lineSmooth: true,
      showLegend: true, legendPos: 'b', legendColor: 'C9D7E5', legendFontSize: 10,
      catAxisLabelColor: '8CA3B8', catAxisLabelFontSize: 10, catAxisLineColor: '24405C',
      valAxisLabelColor: '8CA3B8', valAxisLabelFontSize: 9, valAxisLineColor: '24405C',
      valGridLine: { color: '1B2E44', size: 0.5 }, catGridLine: { style: 'none' },
      valAxisLabelFormatCode: '#,##0,,"L"',
      showTitle: false, plotArea: { fill: { color: C.bg } },
    });

    card(pres, s, 8.5, 2.2, 4.23, 1.9, { fill: C.cardHi, line: C.lineHi });
    s.addText(fmtINR(m.incRevenue), { x: 8.78, y: 2.45, w: 3.7, h: 0.5, fontFace: HEAD, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText('incremental revenue over 3 months vs your current run-rate', { x: 8.78, y: 3.0, w: 3.7, h: 0.7, fontFace: BODY, fontSize: 10.5, color: C.muted, margin: 0, lineSpacing: 14, valign: 'top' });

    card(pres, s, 8.5, 4.3, 4.23, 1.9, { fill: C.cardHi, line: C.lineHi });
    s.addText(fmtINR(m.incContribution), { x: 8.78, y: 4.55, w: 3.7, h: 0.5, fontFace: HEAD, fontSize: 26, bold: true, color: C.teal, margin: 0 });
    s.addText('extra contribution that plan throws off at your margin structure', { x: 8.78, y: 5.1, w: 3.7, h: 0.7, fontFace: BODY, fontSize: 10.5, color: C.muted, margin: 0, lineSpacing: 14, valign: 'top' });

    s.addText('Illustrative model. Your audit replaces assumptions with your actual data.', {
      x: 0.6, y: 6.55, w: 12.13, h: 0.3, align: 'center', fontFace: BODY, italic: true, fontSize: 10, color: C.faint, margin: 0,
    });
  }

  // ---------- SLIDE 4 — diagnosis + plan ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    brandHeader(s);
    s.addText('Where the leak is — and the 3-month fix', { x: 0.6, y: 1.05, w: 12, h: 0.55, fontFace: HEAD, fontSize: 26, bold: true, color: C.white, margin: 0 });

    card(pres, s, 0.6, 1.85, 12.13, 1.95, { fill: C.cardHi, line: C.lineHi });
    s.addText(m.leak.title, { x: 0.95, y: 2.12, w: 11.4, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.teal, margin: 0 });
    s.addText(m.leak.body, { x: 0.95, y: 2.58, w: 11.4, h: 0.85, fontFace: BODY, fontSize: 12, color: C.body, margin: 0, lineSpacing: 16, valign: 'top' });
    s.addText(m.leak.lane, { x: 0.95, y: 3.42, w: 11.4, h: 0.28, fontFace: HEAD, fontSize: 10, bold: true, color: C.muted, charSpacing: 2, margin: 0 });

    const phases = [
      ['WEEKS 1–2', 'Diagnose', 'Full P&L audit, channel deep-dive, cohort and margin analysis. A clear picture of where revenue leaks and where the upside sits.'],
      ['WEEKS 3–6', 'Build', 'Fix the foundations — storefront conversion, tracking, creative systems and channel structure — so every rupee of spend works harder.'],
      ['WEEKS 7–12', 'Scale', 'Ramp profitable spend, open new channels and partnerships, and report against contribution margin — not vanity metrics.'],
    ];
    phases.forEach(([days, t, d], i) => {
      const x = 0.6 + i * 4.13;
      card(pres, s, x, 4.05, 3.98, 2.5);
      s.addText(days, { x: x + 0.28, y: 4.3, w: 3.4, h: 0.26, fontFace: HEAD, fontSize: 9.5, bold: true, color: C.teal, charSpacing: 2.5, margin: 0 });
      s.addText(`0${i + 1}  ${t}`, { x: x + 0.28, y: 4.58, w: 3.4, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: C.white, margin: 0 });
      s.addText(d, { x: x + 0.28, y: 5.05, w: 3.42, h: 1.35, fontFace: BODY, fontSize: 10.5, color: C.muted, margin: 0, lineSpacing: 14, valign: 'top' });
    });
    contactFooter(s, pres);
  }

  // ---------- SLIDE 5 — CTA ----------
  {
    const s = pres.addSlide({ masterName: 'DARK' });
    if (logo) s.addImage({ data: logo, x: W / 2 - 0.4, y: 1.15, w: 0.8, h: 0.8 });
    s.addText([
      { text: 'Ready to turn this into your ', options: { color: C.white } },
      { text: '3-month plan?', options: { color: C.teal } },
    ].map((r) => ({ text: r.text, options: { fontFace: HEAD, fontSize: 34, bold: true, ...r.options } })), {
      x: 0.6, y: 2.35, w: 12.13, h: 0.7, align: 'center', margin: 0,
    });
    s.addText('Bring us these numbers. We’ll bring the audit that proves where the money is hiding —\nno decks that drift, no fluff.', {
      x: 1.8, y: 3.3, w: 9.73, h: 0.8, align: 'center', fontFace: BODY, fontSize: 14, color: C.body, margin: 0, lineSpacing: 20,
    });

    // contact buttons
    const buttons = [
      { label: 'ascentdelta.com', url: SITE },
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
      { text: 'Visit ', options: {} },
      { text: 'ascentdelta.com/growth-engine', options: { hyperlink: { url: `${SITE}/growth-engine` }, color: C.teal } },
      { text: ' → run the engine with next quarter’s targets, or book a full audit.', options: {} },
    ].map((r) => ({ text: r.text, options: { fontFace: BODY, italic: true, fontSize: 11, color: C.muted, ...r.options } })), {
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
  const fileName = `AscentDelta-Growth-Report-Grade-${m.grade}.pptx`;
  return { blob, fileName };
}
