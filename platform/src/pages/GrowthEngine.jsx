import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const TEAL = '#14b8ab';
const TEAL_BRIGHT = '#1fd4c4';
const BLUE = '#2f7fc0';

// ---------- formatting ----------
const fmtINR = (v) => {
  const n = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  if (n >= 1e7) return `${sign}₹${(n / 1e7).toFixed(n >= 1e8 ? 0 : 2)} Cr`;
  if (n >= 1e5) return `${sign}₹${(n / 1e5).toFixed(n >= 1e6 ? 0 : 1)} L`;
  return `${sign}₹${Math.round(n).toLocaleString('en-IN')}`;
};
const fmtNum = (v) => Math.round(v).toLocaleString('en-IN');

// ---------- animated number ----------
function AnimatedValue({ value, format = fmtINR, className = '', style }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (document.hidden) {
      prev.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.55,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);
  return <span className={className} style={style}>{format(display)}</span>;
}

// ---------- slider row ----------
function SliderRow({ label, hint, value, min, max, step, onChange, display }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{label}</label>
        <span className="text-base font-bold text-white tabular-nums">{display(value)}</span>
      </div>
      <input
        type="range"
        className="ge-slider"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      {hint && <p className="text-[11px] text-neutral-600 mt-1">{hint}</p>}
    </div>
  );
}

// ---------- defaults ----------
const DEFAULTS = { rev: 2500000, aov: 1000, roas: 2.2, cogs: 35, ship: 18, fees: 7 };

export default function GrowthEngine() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const set = (k) => (v) => setInputs((s) => ({ ...s, [k]: v }));

  // Never show tool state in the address bar — strip any query string that
  // arrives via old links, bookmarks or history entries.
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // ---------- the math (same spine as our client decks) ----------
  const m = useMemo(() => {
    const { rev, aov, roas, cogs, ship, fees } = inputs;
    const cmPct = Math.max(1, 100 - cogs - ship - fees); // contribution margin %
    const beRoas = 100 / cmPct;                          // break-even ROAS
    const adSpend = rev / roas;
    const orders = rev / aov;
    const cmPerOrder = (aov * cmPct) / 100;
    const contribution = (rev * cmPct) / 100 - adSpend;  // monthly, after ads
    const gapRatio = roas / beRoas;                      // >1 profitable, <1 losses

    let grade, verdict, verdictSub;
    if (gapRatio >= 1.5 && cmPct >= 35) {
      grade = 'A';
      verdict = 'Profitable — and under-scaled';
      verdictSub = 'Your ads clear break-even with room to spare. Every month you don’t scale spend, you leave contribution on the table.';
    } else if (gapRatio >= 1.25) {
      grade = 'B';
      verdict = 'Profitable, with thin headroom';
      verdictSub = 'Growth is funded — but one CPM spike or a creative fatigue cycle could push you under water.';
    } else if (gapRatio >= 1.0) {
      grade = 'C';
      verdict = 'Knife-edge economics';
      verdictSub = 'You’re barely above break-even. Scaling spend right now would likely tip you into buying revenue at a loss.';
    } else if (gapRatio >= 0.8) {
      grade = 'D';
      verdict = 'You’re buying revenue at a loss';
      verdictSub = 'Every order costs more to acquire than it contributes. Growth is being rented from the ad platforms.';
    } else {
      grade = 'F';
      verdict = 'The engine is burning cash';
      verdictSub = 'Ad spend is far above what your margins can repay. Fix the funnel before another rupee goes to prospecting.';
    }

    // biggest leak diagnosis
    let leak;
    if (cmPct < 25) {
      leak = {
        title: 'Your biggest leak: unit economics',
        body: `Only ${cmPct}% of every order survives COGS, logistics and fees. Before touching ad budgets, we attack RTO (WhatsApp address confirmation, COD verification, prepaid nudges) and renegotiate the cost stack — every point of margin recovered lowers your break-even ROAS.`,
        lane: 'Lane 01 · Unit Economics + Lane 04 · Website & CRO',
      };
    } else if (gapRatio < 1.0) {
      leak = {
        title: 'Your biggest leak: paid efficiency',
        body: `You need ${beRoas.toFixed(1)}x just to break even but you’re blending ${inputs.roas.toFixed(1)}x. That is almost never a bid-strategy problem — it’s creative fatigue and a leaky landing page. Hook-led creative testing plus CRO typically closes this gap fastest.`,
        lane: 'Lane 03 · Creative Strategy + Lane 02 · Performance',
      };
    } else if (gapRatio < 1.3) {
      leak = {
        title: 'Your biggest leak: no owned revenue',
        body: 'At knife-edge ROAS, the cheapest fix is revenue that costs nothing to re-acquire. A WhatsApp-first lifecycle engine (welcome, replenishment, winback) lifts blended ROAS without touching the ad account.',
        lane: 'Lane 05 · CRM & Retention',
      };
    } else {
      leak = {
        title: 'Your biggest opportunity: controlled scale',
        body: `With ${fmtINR(cmPerOrder)} of contribution per order and break-even at ${beRoas.toFixed(1)}x, you can afford a more aggressive prospecting CAC than you’re using. The play is scaling spend while holding efficiency — creative volume, new channels, quick commerce.`,
        lane: 'Lane 02 · Performance + Lane 06 · Quick Commerce',
      };
    }

    // 3-month (90-day) projection — efficiency-led, same-spend model
    const daily = rev / 30;
    const mult = (d) => {
      if (d <= 15) return 1;                                    // diagnose
      if (d <= 45) return 1 + 0.22 * ((d - 15) / 30);           // build: CRO + AOV fixes
      return 1.22 + 0.33 * ((d - 45) / 45);                     // scale: spend + retention
    };
    const points = [];
    let cumBase = 0, cumPlan = 0;
    for (let d = 0; d <= 90; d += 2) {
      const plan = daily * mult(d);
      points.push({ d, base: daily, plan });
    }
    for (let d = 1; d <= 90; d++) {
      cumBase += daily;
      cumPlan += daily * mult(d);
    }
    const incRevenue = cumPlan - cumBase;
    const incContribution = (incRevenue * cmPct) / 100;

    return { cmPct, beRoas, adSpend, orders, cmPerOrder, contribution, gapRatio, grade, verdict, verdictSub, leak, points, daily, mult, incRevenue, incContribution };
  }, [inputs]);

  // ---------- chart geometry ----------
  const chart = useMemo(() => {
    const W = 720, H = 240, PAD_L = 8, PAD_R = 8, PAD_T = 26, PAD_B = 24;
    const maxY = m.daily * 1.62;
    const x = (d) => PAD_L + (d / 90) * (W - PAD_L - PAD_R);
    const y = (v) => H - PAD_B - (v / maxY) * (H - PAD_T - PAD_B);
    const planPath = m.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.d).toFixed(1)},${y(p.plan).toFixed(1)}`).join(' ');
    const planArea = `${planPath} L${x(90)},${H - PAD_B} L${x(0)},${H - PAD_B} Z`;
    const baseY = y(m.daily);
    return { W, H, PAD_B, x, y, planPath, planArea, baseY };
  }, [m]);

  const gradeColor = { A: TEAL_BRIGHT, B: '#4ade80', C: '#facc15', D: '#fb923c', F: '#f87171' }[m.grade];
  const profitable = m.gapRatio >= 1;

  const summaryText = useMemo(() =>
    `My Growth Engine grade: ${m.grade} — ${m.verdict}. Contribution margin ${Math.round(m.cmPct)}%, break-even ROAS ${m.beRoas.toFixed(1)}x vs ${inputs.roas.toFixed(1)}x blended. The 3-month plan is worth ${fmtINR(m.incRevenue)} in incremental revenue. Grade yours at https://ascentdelta.com/growth-engine`,
  [m, inputs.roas]);

  const buildReport = useCallback(async () => {
    const { generateGrowthReport } = await import('../lib/growthReport');
    return generateGrowthReport({ inputs, m, gradeColorHex: gradeColor });
  }, [inputs, m, gradeColor]);

  const saveBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = async () => {
    setBusy(true);
    try {
      const { blob, fileName } = await buildReport();
      saveBlob(blob, fileName);
    } finally { setBusy(false); }
  };

  const canShareFiles = useMemo(() => {
    try { return !!navigator.canShare && navigator.canShare({ files: [new File([''], 'r.pptx')] }); }
    catch { return false; }
  }, []);

  const shareFile = async () => {
    setBusy(true);
    try {
      const { blob, fileName } = await buildReport();
      const file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'AscentDelta Growth Engine Report', text: summaryText });
      } else {
        saveBlob(blob, fileName);
      }
    } catch { /* user cancelled the share sheet */ }
    finally { setBusy(false); }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard unavailable */ }
  };

  const waHref = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(`My Growth Engine scorecard — grade ${m.grade}`)}&body=${encodeURIComponent(`${summaryText}\n\n(The full branded report is a one-click download on the same page.)`)}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 relative">
      {/* scoped slider styles — keeps global CSS untouched */}
      <style>{`
        .ge-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px;
          background: linear-gradient(90deg, ${TEAL}, ${BLUE}); outline: none; cursor: pointer; }
        .ge-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 3px solid ${TEAL}; box-shadow: 0 0 0 4px rgba(20,184,171,.18), 0 2px 10px rgba(0,0,0,.5); transition: transform .15s; }
        .ge-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .ge-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid ${TEAL};
          box-shadow: 0 0 0 4px rgba(20,184,171,.18), 0 2px 10px rgba(0,0,0,.5); }
      `}</style>

      {/* header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-white">
          The{' '}
          <span className="bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent">Growth Engine</span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed mt-5 max-w-2xl">
          Drag the sliders to your real numbers. See instantly whether your ads are buying
          profit or losses — and what the next 3 months could be worth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* inputs */}
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-7">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#14b8ab] mb-6">Your numbers</h2>
          <SliderRow label="Monthly revenue" value={inputs.rev} min={100000} max={50000000} step={100000}
            onChange={set('rev')} display={fmtINR} />
          <SliderRow label="Average order value" value={inputs.aov} min={200} max={5000} step={50}
            onChange={set('aov')} display={(v) => `₹${fmtNum(v)}`} />
          <SliderRow label="Blended ROAS" value={inputs.roas} min={0.8} max={8} step={0.1}
            onChange={set('roas')} display={(v) => `${v.toFixed(1)}x`}
            hint="Total revenue ÷ total ad spend — not what Meta reports." />
          <div className="h-px bg-neutral-800 my-6" />
          <SliderRow label="COGS" value={inputs.cogs} min={10} max={70} step={1}
            onChange={set('cogs')} display={(v) => `${v}%`} />
          <SliderRow label="Shipping + RTO" value={inputs.ship} min={5} max={35} step={1}
            onChange={set('ship')} display={(v) => `${v}%`}
            hint="Forward + reverse logistics, weighted for returned COD orders." />
          <SliderRow label="Payment fees + packaging" value={inputs.fees} min={2} max={15} step={1}
            onChange={set('fees')} display={(v) => `${v}%`} />
        </div>

        {/* verdict */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-3xl p-7 flex-1"
            style={{ boxShadow: `inset 0 0 120px -60px ${profitable ? 'rgba(20,184,171,.35)' : 'rgba(248,113,113,.25)'}` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-7">
              <motion.div
                key={m.grade}
                initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 border-2"
                style={{ borderColor: gradeColor, background: `${gradeColor}14` }}
              >
                <span className="text-5xl font-black" style={{ color: gradeColor }}>{m.grade}</span>
              </motion.div>
              <div>
                <motion.h2
                  key={m.verdict}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-2xl md:text-3xl font-bold tracking-tight text-white"
                >
                  {m.verdict}
                </motion.h2>
                <p className="text-sm text-neutral-400 leading-relaxed mt-2 max-w-lg">{m.verdictSub}</p>
              </div>
            </div>

            {/* ROAS gauge */}
            <div className="mb-7">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                <span>Break-even ROAS: <span className="text-white">{m.beRoas.toFixed(1)}x</span></span>
                <span>Your ROAS: <span style={{ color: profitable ? TEAL_BRIGHT : '#f87171' }}>{inputs.roas.toFixed(1)}x</span></span>
              </div>
              <div className="relative h-3 rounded-full bg-neutral-800 overflow-visible">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  animate={{ width: `${Math.min(100, (inputs.roas / 8) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  style={{ background: `linear-gradient(90deg, ${TEAL}, ${profitable ? TEAL_BRIGHT : '#f87171'})` }}
                />
                <motion.div
                  className="absolute -top-1.5 w-0.5 h-6 bg-white"
                  animate={{ left: `${Math.min(100, (m.beRoas / 8) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <p className="text-[11px] text-neutral-600 mt-2">The white marker is your break-even line — everything right of it is profit.</p>
            </div>

            {/* stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden">
              {[
                { label: 'Contribution / order', val: m.cmPerOrder, fmt: fmtINR },
                { label: 'Contribution margin', val: m.cmPct, fmt: (v) => `${Math.round(v)}%` },
                { label: 'Monthly ad spend', val: m.adSpend, fmt: fmtINR },
                { label: 'Monthly profit after ads', val: m.contribution, fmt: fmtINR, colored: true },
              ].map((s) => (
                <div key={s.label} className="bg-neutral-950 px-4 py-4">
                  <AnimatedValue
                    value={s.val} format={s.fmt}
                    className="text-xl md:text-2xl font-bold tracking-tight tabular-nums"
                    style={{ color: s.colored ? (m.contribution >= 0 ? TEAL_BRIGHT : '#f87171') : '#fff' }}
                  />
                  <p className="text-[11px] text-neutral-500 font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* projection chart */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-7 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#14b8ab] mb-2">The next 3 months</h2>
            <p className="text-neutral-400 text-sm max-w-xl">
              Daily revenue if we run the same playbook we sell — fix conversion and retention first
              (weeks 3–6), then scale what converts (weeks 7–12). Efficiency first, budget second.
            </p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            <div>
              <AnimatedValue value={m.incRevenue} className="text-2xl md:text-3xl font-bold text-white tabular-nums" />
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">incremental revenue</p>
            </div>
            <div>
              <AnimatedValue value={m.incContribution} className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: TEAL_BRIGHT }} />
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">extra contribution</p>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${chart.W} ${chart.H}`} className="w-full h-auto" role="img" aria-label="3-month revenue projection">
            <defs>
              <linearGradient id="geArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity="0.35" />
                <stop offset="100%" stopColor={BLUE} stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="geStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={TEAL_BRIGHT} />
                <stop offset="100%" stopColor={BLUE} />
              </linearGradient>
            </defs>

            {/* phase separators + labels */}
            {[{ d: 15, l: 'DIAGNOSE' }, { d: 45, l: 'BUILD' }, { d: 90, l: 'SCALE' }].map((ph, i, arr) => {
              const x0 = chart.x(i === 0 ? 0 : arr[i - 1].d);
              return (
                <g key={ph.l}>
                  <line x1={chart.x(ph.d)} y1="14" x2={chart.x(ph.d)} y2={chart.H - chart.PAD_B}
                    stroke="#262626" strokeDasharray="3 4" />
                  <text x={(x0 + chart.x(ph.d)) / 2} y="12" textAnchor="middle"
                    fill="#525252" fontSize="9" fontWeight="700" letterSpacing="2">{ph.l}</text>
                </g>
              );
            })}

            {/* baseline */}
            <line x1={chart.x(0)} y1={chart.baseY} x2={chart.x(90)} y2={chart.baseY}
              stroke="#404040" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={chart.x(2)} y={chart.baseY - 6} fill="#737373" fontSize="9" fontWeight="600">today’s run-rate</text>

            {/* plan */}
            <path d={chart.planArea} fill="url(#geArea)" />
            <motion.path
              d={chart.planPath} fill="none" stroke="url(#geStroke)" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* end dot */}
            <circle cx={chart.x(90)} cy={chart.y(m.points[m.points.length - 1].plan)} r="5" fill={TEAL_BRIGHT}>
              <animate attributeName="opacity" values="1;.35;1" dur="1.6s" repeatCount="indefinite" />
            </circle>

            {/* axis labels */}
            {[{ d: 0, l: 'Today' }, { d: 30, l: 'Month 1' }, { d: 60, l: 'Month 2' }, { d: 90, l: 'Month 3' }].map((t) => (
              <text key={t.d} x={chart.x(t.d)} y={chart.H - 6} textAnchor={t.d === 0 ? 'start' : t.d === 90 ? 'end' : 'middle'} fill="#525252" fontSize="9">{t.l}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* diagnosis + share */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-neutral-950 border border-neutral-800 rounded-3xl p-7">
          <motion.div
            key={m.leak.title}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-3">{m.leak.title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">{m.leak.body}</p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#14b8ab] bg-[#14b8ab]/10 px-3 py-1.5 rounded-full">
              {m.leak.lane}
            </span>
          </motion.div>
        </div>

        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-7 flex flex-col justify-center">
          <h3 className="text-base font-bold text-white mb-1.5">Take your report with you</h3>
          <p className="text-sm text-neutral-400 leading-relaxed mb-5">
            A fully branded deck of your scorecard, 3-month projection and fix-plan —
            ready to forward to a co-founder or investor.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={downloadReport}
              disabled={busy}
              className="w-full rounded-full px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
              style={{ background: `linear-gradient(110deg, ${TEAL}, #1b5e97)` }}
            >
              {busy ? 'Preparing your report…' : '↓ Download full report (.pptx)'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShareOpen((o) => !o)}
                className="w-full rounded-full px-5 py-3.5 text-sm font-semibold border border-neutral-700 text-white hover:border-[#14b8ab] hover:text-[#14b8ab] transition-colors"
              >
                Share report {shareOpen ? '▴' : '▾'}
              </button>
              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl overflow-hidden"
                  >
                    {canShareFiles && (
                      <button
                        onClick={() => { setShareOpen(false); shareFile(); }}
                        className="w-full text-left px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors"
                      >
                        📎 Share the file — WhatsApp, Gmail &amp; more
                      </button>
                    )}
                    <a
                      href={waHref} target="_blank" rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="block px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors border-t border-neutral-800 first:border-t-0"
                    >
                      🟢 WhatsApp — send my scorecard summary
                    </a>
                    <a
                      href={mailHref}
                      onClick={() => setShareOpen(false)}
                      className="block px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors border-t border-neutral-800"
                    >
                      ✉️ Email — summary + report attached by you
                    </a>
                    <button
                      onClick={copySummary}
                      className="w-full text-left px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors border-t border-neutral-800"
                    >
                      {copied ? '✓ Copied to clipboard' : '📋 Copy summary text'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="relative rounded-[2.5rem] border border-neutral-800 overflow-hidden px-8 py-14 md:px-16 text-center"
        style={{ background: 'radial-gradient(ellipse 90% 120% at 50% -20%, rgba(20,184,171,0.14), rgba(27,94,151,0.06) 55%, transparent 80%)' }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-[1.05] text-white mb-4">
          That <AnimatedValue value={m.incContribution} className="bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent" /> isn’t hypothetical.
        </h2>
        <p className="text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
          It’s what a structured 3-month engagement is built to unlock. Bring us these numbers —
          we’ll bring the audit that proves where it’s hiding.
        </p>
        <button
          onClick={() => navigate('/contact')}
          className="rounded-full px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:shadow-[0_20px_50px_rgba(20,184,171,0.25)] hover:scale-[1.03]"
          style={{ background: 'linear-gradient(110deg, #14b8ab, #1b5e97)' }}
        >
          Turn this into my 3-month plan
        </button>
        <p className="text-xs text-neutral-600 mt-6">
          Illustrative model — assumes efficiency-led gains (CRO, creative, retention) before budget increases.
          Your audit replaces assumptions with your actual data. Also try the{' '}
          <Link to="/ai-scan" className="text-[#14b8ab] hover:underline">free AI website scan</Link>.
        </p>
      </div>
    </div>
  );
}
