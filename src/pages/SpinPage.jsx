import { useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SEGMENTS = [
  { label: '10% endirim', color: '#1a2e5a' },
  { label: 'Pulse aksessuarı', color: '#26aec4' },
  { label: 'Bələdçi xidməti', color: '#2b3a67' },
  { label: '5% endirim', color: '#4a5b96' },
  { label: 'Rəy mükafatı', color: '#35507e' },
  { label: 'Qeydiyyat bonusu', color: '#3cc3d8' },
  { label: '15% endirim', color: '#14204d' },
  { label: 'Təşəbbəs hediyyəsi', color: '#5b6ca8' },
];

const COUNT = SEGMENTS.length;
const ARC = 360 / COUNT;
const FULL_TURNS = 5;
const SPIN_MS = 4200;

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx, cy, r, startAngle) {
  const endAngle = startAngle + ARC;
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 0 1 ${end.x} ${end.y}`,
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

  const spin = () => {
    if (spinning) return;

    const wheel = wheelRef.current;
    if (!wheel) return;

    // Land on a random segment, then stop with its centre under the pointer.
    const index = Math.floor(Math.random() * COUNT);
    const segmentCentre = index * ARC + ARC / 2;
    const offset = (360 - (segmentCentre + rotationRef.current)) % 360;
    const target = rotationRef.current + FULL_TURNS * 360 + offset;

    setSpinning(true);
    setResult(null);

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
      setResult(SEGMENTS[index]);
    };
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
        <h1 className="text-center text-[#1a2e5a] font-heading font-bold text-[24px] sm:text-[32px] tracking-wide">
          Spin &amp; Win
        </h1>

        <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px]">
          {/* pointer */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-1 z-20"
            style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))' }}
          >
            <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true">
              <path d="M13 34 L2 10 A12 12 0 0 1 24 10 Z" fill="#ffffff" stroke="#1a2e5a" strokeWidth="2" />
            </svg>
          </div>

          {/* wheel */}
          <div className="absolute inset-0">
            <div
              ref={wheelRef}
              className="w-full h-full"
              style={{ willChange: 'transform' }}
            >
              <svg viewBox="0 0 240 240" className="w-full h-full" role="img" aria-label="Fırlatma çarxı">
                <circle cx="120" cy="120" r="118" fill="#ffffff" stroke="#1a2e5a" strokeWidth="3" />

                {SEGMENTS.map((segment, i) => {
                  const lines = wrapLabel(segment.label);
                  const lineH = 9;
                  const startY = 48 - ((lines.length - 1) * lineH) / 2;
                  return (
                    <g key={segment.label}>
                      <path
                        d={segmentPath(120, 120, 116, i * ARC)}
                        fill={segment.color}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="700"
                        textAnchor="middle"
                        transform={`rotate(${i * ARC + ARC / 2} 120 120)`}
                      >
                        {lines.map((line, li) => (
                          <tspan key={li} x="120" y={startY + li * lineH}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}

                <circle cx="120" cy="120" r="26" fill="#ffffff" stroke="#1a2e5a" strokeWidth="3" />
                <circle cx="120" cy="120" r="7" fill="#26aec4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="w-[180px] h-[52px] rounded-full bg-[#26aec4] text-[#080d4a] font-heading font-bold text-[18px] tracking-wide hover:bg-[#3cc3d8] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_18px_rgba(38,174,196,0.35)]"
          >
            {spinning ? 'Fırladılır...' : 'Firlat'}
          </button>
        </div>
      </main>

      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={() => setResult(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#26aec4]/15 flex items-center justify-center">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#1a2e5a" aria-hidden="true">
                <path d="M12 2l2.4 6.6L21 8l-5.2 4.6L17.6 20 12 16.4 6.4 20l1.8-7.4L3 8l6.6-1.4z" />
              </svg>
            </div>
            <h3 className="text-[#1a2e5a] font-heading font-bold text-[20px] sm:text-[22px] tracking-wide mb-1">
              Təbriklər!
            </h3>
            <p className="text-[14px] text-[#323643]/70 mb-4">
              Çarxda sizə çıxdı:
            </p>
            <p className="text-[#1a8a99] font-bold text-[22px] sm:text-[24px] mb-7">
              {result.label}
            </p>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="w-[150px] h-[48px] rounded-full bg-[#080d4a] text-white font-heading font-bold text-[16px] tracking-wide hover:bg-[#1a2e5a] transition-all cursor-pointer"
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