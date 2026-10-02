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

                {SEGMENTS.map((segment, i) => (
                  <g key={segment.label}>
                    <path
                      d={segmentPath(120, 120, 116, i * ARC)}
                      fill={segment.color}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      transform={`rotate(${i * ARC + ARC / 2} 120 120)`}
                    >
                      <tspan x="120" y="56">
                        {segment.label.length > 15 ? `${segment.label.slice(0, 14)}…` : segment.label}
                      </tspan>
                    </text>
                  </g>
                ))}

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

          <div className="h-6 text-center">
            {result && !spinning && (
              <p className="text-[15px] sm:text-[17px] font-semibold text-[#1a2e5a]">
                Nəticə: <span className="text-[#1a8a99]">{result.label}</span>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}