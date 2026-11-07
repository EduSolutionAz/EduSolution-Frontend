import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// R2-dəkilərin ağ fonu lokal şəffaf PNG ilə əvəz edilib (public/assets/universities)
const LOCAL_LOGO_MAP = {
  'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/prague_technic_logo': '/assets/universities/prague_technic_logo.png',
  'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/baku_state_university_logo': '/assets/universities/baku_state_university_logo.png',
};

export default function Partners() {
  const [logos, setLogos] = useState(FALLBACK_LOGOS);
  const [copiesPerSet, setCopiesPerSet] = useState(1);
  const marqueeRef = useRef(null);
  const sequenceRef = useRef(null);

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

  // Repeat only enough logo sequences to cover one viewport. Measuring the
  // rendered sequence makes the copy count fall as more logos are added.
  useLayoutEffect(() => {
    const updateCopies = () => {
      if (logos.length === 0) {
        setCopiesPerSet(1);
        return;
      }

      const sequenceWidth = sequenceRef.current?.getBoundingClientRect().width || 0;
      const viewportWidth = marqueeRef.current?.clientWidth || 0;
      if (sequenceWidth <= 0 || viewportWidth <= 0) return;

      const nextCopies = Math.max(1, Math.ceil(viewportWidth / sequenceWidth));
      setCopiesPerSet((current) => (current === nextCopies ? current : nextCopies));
    };

    updateCopies();
    const observer = new ResizeObserver(updateCopies);
    if (marqueeRef.current) observer.observe(marqueeRef.current);
    if (sequenceRef.current) observer.observe(sequenceRef.current);
    return () => observer.disconnect();
  }, [logos]);

  const logoCopies = Array.from({ length: copiesPerSet }, (_, index) => index);

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
          {'Partnyorlarımız'}
        </h2>
      </div>

      {/* Start at the first logo and loop one full repeated set at a time. */}
      <div
        ref={marqueeRef}
        className="marquee-group relative overflow-x-hidden py-3"
        style={{ overflowY: 'visible' }}
      >
        <div className="marquee-track flex w-max py-2">
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="marquee-copy-group flex shrink-0"
              aria-hidden={setIndex === 1}
            >
              {logoCopies.map((copyIndex) => (
                <div
                  key={copyIndex}
                  ref={setIndex === 0 && copyIndex === 0 ? sequenceRef : null}
                  className="marquee-sequence flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
                >
                  {logos.map((logo, logoIndex) => (
                    <img
                      key={`${setIndex}-${copyIndex}-${logo.src}-${logoIndex}`}
                      src={logo.src}
                      alt={setIndex === 0 && copyIndex === 0 ? logo.alt : ''}
                      className="h-11 sm:h-13 lg:h-16 w-auto max-w-[150px] sm:max-w-[170px] object-contain shrink-0 transition-transform duration-300 ease-out hover:scale-[1.18] cursor-pointer will-change-transform"
                      loading={setIndex === 0 && copyIndex === 0 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
