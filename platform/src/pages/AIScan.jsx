import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const SCAN_STEPS = [
  'Fetching page & taking screenshot…',
  'Running Google PageSpeed audit…',
  'Analysing CRO & UX signals…',
  'Evaluating trust signals & cart flow…',
  'Generating AI recommendations…',
  'Compiling report & sending email…',
];

const SECTIONS = [
  { key: 'cro',          label: 'Conversion Rate Optimisation', icon: '📈' },
  { key: 'ux',           label: 'UX & Design',                  icon: '🎨' },
  { key: 'mobile',       label: 'Mobile Experience',            icon: '📱' },
  { key: 'trustSignals', label: 'Trust Signals',                icon: '🛡️' },
  { key: 'cart',         label: 'Cart & Checkout',              icon: '🛒' },
  { key: 'abandonedCart',label: 'Abandoned Cart Recovery',      icon: '🔄' },
  { key: 'content',      label: 'Content & Copy',               icon: '✍️' },
  { key: 'seo',          label: 'SEO Fundamentals',             icon: '🔍' },
  { key: 'accessibility',label: 'Accessibility',                icon: '♿' },
];

function scoreColor(s) {
  if (s >= 80) return { text: '#16a34a', bg: '#dcfce7', border: '#16a34a' };
  if (s >= 60) return { text: '#d97706', bg: '#fef9c3', border: '#d97706' };
  return { text: '#dc2626', bg: '#fee2e2', border: '#dc2626' };
}

function ScoreRing({ score, size = 80 }) {
  const c = scoreColor(score);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c.text} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: c.text, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
}

function SpeedCard({ label, value, good }) {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{label}</div>
      <div className={`text-xl font-bold ${good ? 'text-green-600' : 'text-amber-500'}`}>{value ?? 'N/A'}</div>
    </div>
  );
}

function SectionCard({ section, data }) {
  const [open, setOpen] = useState(false);
  const c = scoreColor(data.score);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
      >
        <span className="text-2xl">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-neutral-900 dark:text-white text-base">{section.label}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{data.headline}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreRing score={data.score} size={56} />
          <span className="text-neutral-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6 grid md:grid-cols-2 gap-6 border-t border-neutral-100 dark:border-neutral-800 pt-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Issues Found</h4>
                <ul className="space-y-2">
                  {(data.issues || []).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span> {issue}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {(data.recommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIScan() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);

  const startScan = async () => {
    if (!url.trim() || !email.trim()) {
      setError('Please enter both a website URL and your email address.');
      return;
    }
    setError('');
    setReport(null);
    setScanning(true);
    setStepIndex(0);

    // Animate steps while scan runs
    const stepTimer = setInterval(() => {
      setStepIndex(i => (i < SCAN_STEPS.length - 1 ? i + 1 : i));
    }, 9000);

    try {
      const res = await fetch(`${API}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      // Defer rendering so the UI stays responsive
      setTimeout(() => setReport(data.report), 50);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(stepTimer);
      setScanning(false);
    }
  };

  const downloadPDF = useCallback(() => {
    const prev = document.title;
    document.title = 'AscentDelta AI Scan';
    window.print();
    document.title = prev;
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 bg-[#14b5bc]/10 text-[#14b5bc] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-[#14b5bc] rounded-full animate-pulse" />
          AI-Powered
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-black dark:text-white">
          Website<br />AI Scan
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-5 max-w-xl">
          Drop your URL. Get a ruthlessly honest, AI-generated audit — speed, CRO, cart, trust signals, and more. Delivered to your inbox instantly.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 mb-10 shadow-sm" style={{boxShadow: '0 2px 24px rgba(0,0,0,0.06)'}}>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://yourstore.com"
              disabled={scanning}
              className="w-full bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-[#14b5bc] rounded-xl px-4 py-3.5 text-base text-neutral-900 dark:text-white placeholder-neutral-400 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@brand.com"
              disabled={scanning}
              className="w-full bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-[#14b5bc] rounded-xl px-4 py-3.5 text-base text-neutral-900 dark:text-white placeholder-neutral-400 outline-none transition-colors"
            />
          </div>
        </div>


        <button
          onClick={startScan}
          disabled={scanning}
          className="w-full font-bold text-base py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-white"
          style={{ background: '#14b5bc' }}
        >
          {scanning ? 'Scanning…' : 'Run Deep Scan →'}
        </button>

        <p className="text-center text-xs text-neutral-400 mt-3">Scan takes 45–90 seconds. Full report appears on screen.</p>
      </div>

      {/* Scanning animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-[#14b5bc] rounded-full animate-pulse" />
              <span className="font-bold text-neutral-900 dark:text-white">Deep scan in progress…</span>
            </div>
            <div className="space-y-3">
              {SCAN_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                  i < stepIndex ? 'text-green-600' : i === stepIndex ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-300 dark:text-neutral-600'
                }`}>
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs
                    border-current">
                    {i < stepIndex ? '✓' : i === stepIndex ? '…' : ''}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-6 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#14b5bc] rounded-full"
                animate={{ width: `${((stepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error modal */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={() => setError('')}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(20,181,188,0.12)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#14b5bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                High Demand Right Now
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                Our AI scan servers are currently at capacity. Please wait a moment and try again — your scan will go through shortly.
              </p>

              <button
                onClick={() => setError('')}
                className="w-full font-bold text-sm py-3.5 rounded-xl text-white hover:opacity-90 transition-opacity"
                style={{ background: '#14b5bc' }}
              >
                Got it, I'll try again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report */}
      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Download button */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Audit Report</h2>
                <p className="text-sm text-neutral-400 mt-1">{report.url} · {new Date(report.generatedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-80 transition-opacity"
                style={{ background: '#14b5bc' }}
              >
                ↓ Download / Print
              </button>
            </div>

            <div ref={reportRef} id="ai-report">
              {/* Overall score hero */}
              <div className="bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-transparent rounded-3xl p-8 mb-6 flex flex-col md:flex-row items-center gap-8">
                <ScoreRing score={report.ai.overallScore} size={120} />
                <div className="flex-1">
                  <div className="text-[#14b5bc] text-xs font-bold uppercase tracking-widest mb-2">Overall Score · Grade {report.ai.grade}</div>
                  <p className="text-neutral-800 dark:text-white text-lg leading-relaxed">{report.ai.summary}</p>
                </div>
              </div>

              {/* Speed metrics */}
              {(report.speed.mobile || report.speed.desktop) && (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>⚡</span> Page Speed — Google Lighthouse
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <SpeedCard label="Mobile Score"   value={`${report.speed.mobile?.score ?? 'N/A'}/100`}  good={report.speed.mobile?.score >= 70} />
                    <SpeedCard label="Desktop Score"  value={`${report.speed.desktop?.score ?? 'N/A'}/100`} good={report.speed.desktop?.score >= 80} />
                    <SpeedCard label="LCP"            value={report.speed.mobile?.lcp}   good={false} />
                    <SpeedCard label="CLS"            value={report.speed.mobile?.cls}   good={false} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <SpeedCard label="TBT"            value={report.speed.mobile?.tbt}         good={false} />
                    <SpeedCard label="TTI"            value={report.speed.mobile?.tti}         good={false} />
                    <SpeedCard label="Speed Index"    value={report.speed.mobile?.speedIndex}  good={false} />
                    <SpeedCard label="Accessibility"  value={`${report.speed.mobile?.accessibility ?? 'N/A'}/100`} good={report.speed.mobile?.accessibility >= 80} />
                  </div>
                </div>
              )}

              {/* Top priorities */}
              <div className="bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-transparent rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> Top 5 Priority Actions
                </h3>
                <div className="space-y-3">
                  {(report.ai.topPriorities || []).map(p => (
                    <div key={p.priority} className="flex items-start gap-4 bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent rounded-xl px-5 py-4">
                      <span className="text-[#14b5bc] font-black text-lg flex-shrink-0">#{p.priority}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-neutral-900 dark:text-white font-semibold text-sm">{p.action}</div>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-neutral-500">Impact: <span className="text-[#14b5bc] font-bold">{p.impact}</span></span>
                          <span className="text-xs text-neutral-500">Effort: <span className="text-neutral-700 dark:text-neutral-300 font-bold">{p.effort}</span></span>
                          <span className="text-xs text-neutral-500">{p.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section cards */}
              <div className="space-y-3">
                {SECTIONS.map(section => (
                  report.ai[section.key] && (
                    <SectionCard key={section.key} section={section} data={report.ai[section.key]} />
                  )
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 text-center text-xs text-neutral-400">
                Report generated by <span className="text-[#14b5bc] font-bold">AscentDelta AI Scan</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
