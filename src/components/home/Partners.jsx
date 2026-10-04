import { useEffect, useRef, useState } from 'react';
import { getUniversityLogos } from '../../services/contentApi';
import { mapUniversityLogos } from '../../services/mappers';

// ─── MOCK DATA (söndürülüb) ────────────────────────────────────────────
// Data artıq API-dən gəlir. Lazım olsa SADƏCƏ bunu geri aç:
// FALLBACK_LOGOS-ı ağrıdan setLogos üçün default etmək kifayətdir.
// const FALLBACK_LOGOS = [
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/budapest_metropolitan_university_logo.png', alt: 'Budapest Metropolitan University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/cyprus-science-university-logo.png', alt: 'Cyprus Science University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/medipol_university_logo.png', alt: 'Medipol University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/vistula_university_logo.png', alt: 'Vistula University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/vizja_logo.png', alt: 'VIZJA University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/ted.png', alt: 'TED University' },
//   { src: '/assets/wsb_logo_transparent.png', alt: 'WSB University' },
//   { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/world_peace_university_logo.png', alt: 'World Peace University' },
// ];
const FALLBACK_LOGOS = [];

const DURATION = 22; // seconds — must match .marquee-track animation duration
const STORAGE_KEY = 'edusolution_partners_marquee_time';

// R2-dəkilərin ağ fonu lokal şəffaf PNG ilə əvəz edilib (public/assets/universities)
const LOCAL_LOGO_MAP = {
  'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/prague_technic_logo': '/assets/universities/prague_technic_logo.png',
  'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/baku_state_university_logo': '/assets/universities/baku_state_university_logo.png',
};

function loadSavedTime() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return 0;
    return ((value % DURATION) + DURATION) % DURATION;
  } catch {
    return 0;
  }
}

function saveTime(t) {
  try {
    localStorage.setItem(STORAGE_KEY, String(t));
  } catch {
    /* ignore */
  }
}

export default function Partners() {
  const [logos, setLogos] = useState(FALLBACK_LOGOS);
  const trackRef = useRef(null);
  const timeRef = useRef(loadSavedTime());
  const lastRef = useRef(Date.now());
  const pausedRef = useRef(false);
  const savedSecondRef = useRef(timeRef.current);
  const delaySetRef = useRef(false);

  useEffect(() => {
    let active = true;
    getUniversityLogos()
      .then((data) => {
        if (!active) return;
        const fromApi = mapUniversityLogos(data);
        const remapped = fromApi.map((logo) => ({
          ...logo,
          src: LOCAL_LOGO_MAP[logo.src] || logo.src,
        }));
        setLogos(remapped.length > 0 ? remapped : []);
      })
      .catch(() => {
        /* API xətası → boş qalır */
      });
    return () => {
      active = false;
    };
  }, []);

  // resume animation from saved position using negative animation-delay
  useEffect(() => {
    if (delaySetRef.current) return;
    delaySetRef.current = true;
    if (trackRef.current) {
      trackRef.current.style.animationDelay = `-${timeRef.current}s`;
    }
  }, []);

  // track time continuously so refresh resumes from where it left off
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = Date.now();
      if (!pausedRef.current) {
        timeRef.current = (timeRef.current + (now - lastRef.current) / 1000) % DURATION;
      }
      lastRef.current = now;

      // persist roughly once per second to reduce writes
      if (Math.floor(timeRef.current) !== Math.floor(savedSecondRef.current)) {
        savedSecondRef.current = timeRef.current;
        saveTime(timeRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="py-7 sm:py-9 overflow-hidden"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h2 className="text-center text-[#1a2e5a] font-heading font-bold text-[20px] sm:text-[22px] tracking-wide mb-7 sm:mb-8">
          Our Partners
        </h2>
      </div>

      {/* marquee wrapper - hover pauses animation - seamless loop */}
      <div
        className="marquee-group relative overflow-x-hidden py-3"
        style={{ overflowY: 'visible' }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          lastRef.current = Date.now();
          pausedRef.current = false;
        }}
      >
        <div
          ref={trackRef}
          className="marquee-track flex items-center gap-8 sm:gap-10 w-max py-2"
        >
          {[...logos, ...logos, ...logos, ...logos].map((p, i) => (
            <img
              key={`${p.src}-${i}`}
              src={p.src}
              alt={p.alt}
              className="h-11 sm:h-13 lg:h-16 w-auto max-w-[150px] sm:max-w-[170px] object-contain shrink-0 transition-transform duration-300 ease-out hover:scale-[1.18] cursor-pointer will-change-transform"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}