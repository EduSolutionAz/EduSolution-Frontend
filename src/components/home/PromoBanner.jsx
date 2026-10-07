import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROMO_ADS } from '../../data/promoAds';

const AUTO_DELAY = 5000;

// Ox düyməsinə verilən handler-lər ötürülməlidir, yoxsa oxun üstünə
// gələndə avtomatik irəliləyiş dayanmur.
function Arrow({ direction, onClick, disabled, onMouseEnter, onMouseLeave }) {
  const isLeft = direction === 'left';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={isLeft ? 'Əvvəlki reklam' : 'Növbəti reklam'}
      className="absolute top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white text-[#080d4a] shadow-[0_4px_14px_rgba(0,0,0,0.22)] hover:bg-[#26aec4] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#080d4a]"
      style={isLeft ? { left: '-14px' } : { right: '-14px' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isLeft ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export default function PromoBanner() {
  const ads = PROMO_ADS;
  const count = ads.length;
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState({});
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const advance = useCallback(
    (step) => setActive((i) => (i + step + count) % count),
    [count],
  );

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [count, active]);

  useEffect(() => {
    setBroken((prev) => {
      const next = { ...prev };
      delete next[active];
      return next;
    });
  }, [active]);

  useEffect(() => {
    if (count < 2) return undefined;

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') advance(-1);
      if (e.key === 'ArrowRight') advance(1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, count]);

  // Advances on its own until the visitor hovers, focuses or switches tab.
  useEffect(() => {
    if (count < 2 || paused) return undefined;
    if (typeof document !== 'undefined' && document.hidden) return undefined;

    const startedAt = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(1, elapsed / AUTO_DELAY));

      if (elapsed >= AUTO_DELAY) {
        advance(1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, paused, advance, count]);

  if (!count) return null;

  const ad = ads[active];
  const isBroken = broken[active];

  return (
    <section
      className="py-8 sm:py-10"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[560px] mx-auto px-8 sm:px-12">
        <div className="relative">
          <Arrow
            direction="left"
            disabled={count < 2}
            onClick={() => advance(-1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          />

          <button
            type="button"
            onClick={() => navigate(`/reklam/${ad.id}`)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="w-full block aspect-square overflow-hidden bg-[#fdf6f3] rounded-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-[#1a2e5a]/10 cursor-pointer group transition-all duration-300 hover:shadow-[0_10px_28px_rgba(0,0,0,0.26)] hover:-translate-y-0.5"
            aria-label={`Reklam: ${ad.title || ad.alt}`}
          >
            {isBroken ? (
              <span className="w-full h-full flex items-center justify-center text-[#080d4a]/60 text-[15px] font-accent font-medium px-6 text-center">
                {ad.title || ad.alt}
              </span>
            ) : (
              <img
                key={active}
                src={ad.src}
                alt={ad.alt}
                className="w-full h-full object-cover select-none promo-settle"
                draggable="false"
                onError={() => setBroken((prev) => ({ ...prev, [active]: true }))}
              />
            )}
          </button>

          <Arrow
            direction="right"
            disabled={count < 2}
            onClick={() => advance(1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          />
        </div>

        {count > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {ads.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => advance(i - active)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                aria-label={`${i + 1}-ci reklam: ${item.title || item.alt}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === active
                    ? 'w-6 bg-[#26aec4]'
                    : 'w-2 bg-[#1a2e5a]/25 hover:bg-[#1a2e5a]/45'
                }`}
              />
            ))}
          </div>
        )}

        <p className="mt-3 text-center text-[12px] text-[#1a2e5a]/55">
          {ad.title || ad.alt}
        </p>

        {count > 1 && !paused && (
          <div className="mt-3 h-[3px] w-full max-w-[220px] mx-auto rounded-full bg-[#1a2e5a]/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#26aec4] transition-none"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}