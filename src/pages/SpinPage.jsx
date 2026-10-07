import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPrizes as getStoredPrizes, subscribe } from '../store/adminStore';
import { useSpinPrizes } from '../services/contentHooks';
import { checkCanPlay, getBrowserId, playSpin, sendPrize } from '../services/spinApi';
import { describeFailure } from '../services/httpClient';

// Admin panelindəki "Spin Nağılları" səhifəsi bu siyahını idarə edir, ona
// görə çarx həmişəlik bu siyahını oxuyur.
const DEFAULT_SEGMENTS = [
  { label: '10% endirim', color: '#14204d', light: '#2b3f7d' },
  { label: 'Pulse aksessuarı', color: '#1f6f8b', light: '#3cc3d8' },
  { label: 'Bələdçi xidməti', color: '#2b3a67', light: '#5b6ca8' },
  { label: '5% endirim', color: '#7a3f9e', light: '#b07ad4' },
  { label: 'Rəy mükafatı', color: '#1f4b8f', light: '#4a7fc1' },
  { label: 'Qeydiyyat bonusu', color: '#a03a63', light: '#e0739f' },
  { label: '15% endirim', color: '#1a6b5c', light: '#3fb59c' },
  { label: 'Təşəbbəs hediyyəsi', color: '#3d5480', light: '#7b93bd' },
];

const COLORS = DEFAULT_SEGMENTS.map((segment) => [segment.color, segment.light]);
const FULL_TURNS = 5;
const SPIN_MS = 4200;
const BULBS = 24;

/**
 * A prize name that is not on the wheel still has to be shown, but the wheel
 * cannot stop on a segment that does not exist, so the label is split: the
 * wheel lands on a real segment and the result text shows the server answer.
 */
function makeResult(serverPrize, segment) {
  return { label: serverPrize || segment?.label || '', wheelLabel: segment?.label || '' };
}

function toSegments(prizes) {
  const names = (prizes || [])
    .map((prize) => prize?.name)
    .filter((name) => typeof name === 'string' && name.trim());

  if (names.length === 0) return DEFAULT_SEGMENTS;

  // Rənglər yalnız bazadakı say qədərdir; siyahı uzun olduqda mövcut
  // palitranı təkrar istifadə edirik ki, heç bir seqment rəngsiz qalmasın.
  return names.map((name, i) => {
    const [color, light] = COLORS[i % COLORS.length];
    return { label: name.trim(), color, light };
  });
}

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * One wedge of the wheel. polar() places 0deg at the top and grows clockwise,
 * so the arc is drawn from startAngle to endAngle with the positive-angle
 * direction flag. Sweeping the other way would trace 360-ARC degrees and
 * overlap every other segment.
 */
function segmentPath(cx, cy, r, startAngle, arc) {
  const endAngle = startAngle + arc;
  const from = polar(cx, cy, r, startAngle);
  const to = polar(cx, cy, r, endAngle);

  return [
    `M ${cx} ${cy}`,
    `L ${from.x} ${from.y}`,
    `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`,
    'Z',
  ].join(' ');
}

// Sözü qonşu seqmentlərə daşmayan qısa sətirlərə bölür (sektora radius boyu yazılır)
function wrapLabel(label, maxLine = 9) {
  const words = label.split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length <= maxLine || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  // çox uzun sözü yalnız həddən çox uzunsa böl
  return lines
    .flatMap((line) => {
      if (line.length <= 12) return [line];
      const parts = [];
      let rest = line;
      while (rest.length > 12) {
        parts.push(rest.slice(0, 12));
        rest = rest.slice(12);
      }
      return rest ? [...parts, rest] : parts;
    })
    .slice(0, 3);
}

export default function SpinPage() {
  const wheelRef = useRef(null);
  const rotationRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [canPlay, setCanPlay] = useState(null);
  const [email, setEmail] = useState('');
  const [sendState, setSendState] = useState({ state: 'idle', message: '' });

  // GET /spin/prizes is the source of truth. The locally stored prizes are
  // only a fallback so the wheel still works before the admin panel has
  // created anything on the backend.
  const { data: apiPrizes } = useSpinPrizes();
  const storedPrizes = useSyncExternalStore(subscribe, getStoredPrizes, getStoredPrizes);
  const prizes = apiPrizes.length > 0 ? apiPrizes : storedPrizes;
  const segments = useMemo(() => toSegments(prizes), [prizes]);
  const count = segments.length;
  const arc = 360 / count;

  useEffect(() => {
    let active = true;

    checkCanPlay({ browserId: getBrowserId() })
      .then((allowed) => {
        if (active) setCanPlay(allowed);
      })
      .catch(() => {
        // The check is an optimisation, not a gate: a failing /spin/check
        // must not disable the wheel, so the state stays unknown and the
        // button stays enabled.
        if (active) setCanPlay(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const spin = async () => {
    if (spinning) return;

    const wheel = wheelRef.current;
    if (!wheel) return;

    setSpinning(true);
    setResult(null);
    setSendState({ state: 'idle', message: '' });

    // The winning prize is decided by the backend. The wheel stops on the
    // matching segment when that prize is on the wheel, and on a random
    // segment otherwise, so the animation still ends cleanly.
    let serverPrize = '';
    try {
      serverPrize = await playSpin(getBrowserId());
    } catch (error) {
      setSpinning(false);
      setSendState({ state: 'error', message: describeFailure(error, 'Çarx fırladıla bilmədi') });
      return;
    }

    const exact = segments.findIndex((segment) => segment.label === serverPrize);
    const index =
      exact >= 0 ? exact : Math.floor(Math.random() * count);

    const segmentCentre = index * arc + arc / 2;
    const offset = (360 - (segmentCentre + rotationRef.current)) % 360;
    const target = rotationRef.current + FULL_TURNS * 360 + offset;

    const animation = wheel.animate(
      [{ transform: `rotate(${rotationRef.current}deg)` }, { transform: `rotate(${target}deg)` }],
      {
        duration: SPIN_MS,
        easing: 'cubic-bezier(0.12, 0.72, 0.15, 1)',
        fill: 'forwards',
      },
    );

    animation.onfinish = () => {
      rotationRef.current = target;
      setSpinning(false);
      setResult(makeResult(serverPrize, segments[index]));
      // A played spin is spent, so the next visit has to ask again.
      setCanPlay(false);
    };
  };

  const handleSendPrize = async () => {
    const value = email.trim();
    if (!value) return;

    setSendState({ state: 'loading', message: '' });
    try {
      const sent = await sendPrize({ browserId: getBrowserId(), email: value });
      setSendState(
        sent
          ? { state: 'success', message: 'Mükafat e-poçt ünvanınıza göndərildi.' }
          : { state: 'error', message: 'Mükafat göndərilmədi.' },
      );
    } catch (error) {
      setSendState({ state: 'error', message: describeFailure(error, 'Mükafat göndərilmədi') });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />

      <main
        className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-10 sm:py-14"
        style={{
          backgroundImage: `linear-gradient(rgba(246,238,238,0.94), rgba(246,238,238,0.94)), url('/assets/topographic.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div className="text-center">
          <h1 className="text-[#0d1440] font-heading font-bold text-[26px] sm:text-[36px] tracking-wide">
            Spin &amp; Win
          </h1>
          <p className="mt-1.5 text-[#1a2e5a]/60 text-[12px] sm:text-[14px]">
            Çarxı fırladın, qazanacağınız mükafatı görün
          </p>
        </div>

        <div
          className="relative w-[280px] h-[280px] sm:w-[370px] sm:h-[370px] rounded-full"
          style={{ boxShadow: '0 22px 55px rgba(8,13,74,0.28)' }}
        >
          {/* glow behind the wheel */}
          <div
            className="absolute -inset-8 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(38,174,196,0.22) 0%, rgba(38,174,196,0) 68%)' }}
          />

          {/* pointer */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-30"
            style={{ top: '-14px', filter: 'drop-shadow(0 4px 6px rgba(8,13,74,0.4))' }}
          >
            <svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true">
              <defs>
                <linearGradient id="ptr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dfe6f5" />
                </linearGradient>
              </defs>
              <path
                d="M15 39 L2.5 11 A13 13 0 0 1 27.5 11 Z"
                fill="url(#ptr)"
                stroke="#0d1440"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="15" cy="10" r="3.6" fill="#26aec4" stroke="#0d1440" strokeWidth="2" />
            </svg>
          </div>

          {/* rotating wheel */}
          <div ref={wheelRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            <svg viewBox="0 0 260 260" className="w-full h-full" role="img" aria-label="Fırlatma çarxı">
<defs>
                  {segments.map((segment, i) => (
                    <linearGradient key={`grad-${segment.label}-${i}`} id={`seg-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={segment.light} />
                    <stop offset="100%" stopColor={segment.color} />
                  </linearGradient>
                ))}
                <radialGradient id="shade" cx="50%" cy="42%" r="58%">
                  <stop offset="55%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
                </radialGradient>
              </defs>

              {/* rim */}
              <circle cx="130" cy="130" r="129" fill="#0d1440" />
              <circle cx="130" cy="130" r="125" fill="none" stroke="#26aec4" strokeOpacity="0.5" strokeWidth="1.5" />

              {/* bulbs */}
              {Array.from({ length: BULBS }, (_, i) => {
                const p = polar(130, 130, 121, (360 / BULBS) * i);
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="2.8"
                    fill={i % 2 === 0 ? '#ffe9a8' : '#fff6d6'}
                    opacity={i % 2 === 0 ? 1 : 0.6}
                  />
                );
              })}

              {/* segments fill the circle edge to edge */}
              {segments.map((segment, i) => (
                <path
                  key={`seg-${segment.label}-${i}`}
                  d={segmentPath(130, 130, 118, i * arc, arc)}
                  fill={`url(#seg-${i})`}
                  stroke="#ffffff"
                  strokeOpacity="0.9"
                  strokeWidth="1.4"
                />
              ))}

              {/* depth shading */}
              <circle cx="130" cy="130" r="118" fill="url(#shade)" pointerEvents="none" />

              {/* labels — placed on each segment's bisector so they sit inside the wedge */}
              {segments.map((segment, i) => {
                const bisector = i * arc + arc / 2;
                const lines = wrapLabel(segment.label, 11);
                const lineH = 11;
                const radius = 72;

                // Segments in the left half would read upside down, so those
                // labels are turned over and moved to the mirrored position,
                // which keeps them upright and inside the same wedge.
                const flipped = bisector > 90 && bisector < 270;
                const rotation = flipped ? bisector + 180 : bisector;
                const anchorY = 130 + (flipped ? radius : -radius);
                const startY = anchorY - ((lines.length - 1) * lineH) / 2;

                return (
                  <g key={`label-${segment.label}-${i}`} transform={`rotate(${rotation} 130 130)`}>
                    <text
                      fill="#ffffff"
                      fontSize="10.5"
                      fontWeight="700"
                      textAnchor="middle"
                      stroke="#0d1440"
                      strokeOpacity="0.4"
                      strokeWidth="0.8"
                      paintOrder="stroke"
                    >
                      {lines.map((line, li) => (
                        <tspan key={li} x="130" y={startY + li * lineH}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {/* hub */}
              <circle cx="130" cy="130" r="31" fill="#0d1440" opacity="0.22" />
              <circle cx="130" cy="130" r="28" fill="#ffffff" stroke="#0d1440" strokeWidth="3" />
              <circle cx="130" cy="130" r="21" fill="none" stroke="#26aec4" strokeOpacity="0.5" strokeWidth="1.5" />
              <circle cx="130" cy="130" r="8" fill="#26aec4" stroke="#0d1440" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="group relative w-[190px] h-[56px] rounded-full font-heading font-bold text-[19px] tracking-wide text-[#08122e] transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_34px_rgba(8,13,74,0.35)] disabled:shadow-none"
            style={{
              background: spinning
                ? 'linear-gradient(135deg,#b9c4dd 0%,#9aa8c8 100%)'
                : 'linear-gradient(135deg,#5fe0f0 0%,#26aec4 55%,#1b93b0 100%)',
              boxShadow: spinning
                ? 'none'
                : '0 10px 26px rgba(38,174,196,0.42), inset 0 1px 0 rgba(255,255,255,0.55)',
            }}
          >
            <span className="relative z-10">{spinning ? 'Fırladılır...' : 'Firlat'}</span>
          </button>

          <p className="text-[11px] text-[#1a2e5a]/45">
            {spinning
              ? 'Çarx yavaşlayır…'
              : canPlay === false
                ? 'Bu brauzer üçün fırlatma həddi dolub — yenidən yoxlayın'
                : `${count} mükafat var — hər fırlatmada yeni biri`}
          </p>

          {sendState.state === 'error' && sendState.message && (
            <p role="alert" className="text-[12px] text-red-600 max-w-xs text-center">
              {sendState.message}
            </p>
          )}
        </div>
      </main>

      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(8,13,74,0.55)', backdropFilter: 'blur(3px)' }}
          onClick={() => setResult(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-[28px] px-8 pt-9 pb-8 text-center"
            style={{
              background: 'linear-gradient(160deg,#ffffff 0%,#f4f7fd 100%)',
              boxShadow: '0 24px 60px rgba(8,13,74,0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#5fe0f0,#26aec4)',
                  boxShadow: '0 8px 20px rgba(38,174,196,0.45)',
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#08122e" aria-hidden="true">
                  <path d="M12 2l2.4 6.6L21 8l-5.2 4.6L17.6 20 12 16.4 6.4 20l1.8-7.4L3 8l6.6-1.4z" />
                </svg>
              </div>
            </div>

            <h3 className="mt-6 text-[#0d1440] font-heading font-bold text-[22px] sm:text-[24px] tracking-wide">
              Təbriklər!
            </h3>
            <p className="mt-1 text-[13px] text-[#323643]/60">Çarxda sizə çıxdı:</p>

            <div className="mt-4 mb-5 py-4 rounded-2xl bg-[#26aec4]/10">
              <p className="text-[#0d7f92] font-heading font-bold text-[20px] sm:text-[22px] leading-tight">
                {result.label}
              </p>
            </div>

            <p className="text-[12px] text-[#323643]/60 mb-2 text-left">
              Mükafatı e-poçt ünvanınıza göndərmək üçün yazın:
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSendState({ state: 'idle', message: '' });
                }}
                placeholder="name@example.com"
                className="flex-1 h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
              />
              <button
                type="button"
                onClick={handleSendPrize}
                disabled={sendState.state === 'loading' || !email.trim()}
                className="shrink-0 h-[42px] px-4 rounded-full bg-[#26aec4] text-[#080d4a] text-[12px] font-accent font-semibold hover:bg-[#3cc3d8] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendState.state === 'loading' ? 'Göndərilir...' : 'Göndər'}
              </button>
            </div>

            {sendState.message && (
              <p
                role="status"
                className={`mt-2 text-[11px] text-left ${
                  sendState.state === 'success' ? 'text-[#1a8a99]' : 'text-red-600'
                }`}
              >
                {sendState.message}
              </p>
            )}

            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-6 w-full h-[48px] rounded-full text-white font-heading font-bold text-[16px] tracking-wide transition-all cursor-pointer hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#1a2e5a,#0d1440)',
                boxShadow: '0 8px 20px rgba(13,20,64,0.3)',
              }}
            >
              Bağla
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}