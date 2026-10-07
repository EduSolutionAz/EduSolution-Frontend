import { useEffect, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAds, subscribe } from '../../store/adminStore';
import { useAllAds } from '../../services/contentHooks';
import { isUserAuthenticated } from '../../services/session';

function isInternal(link) {
  return typeof link === 'string' && link.startsWith('/') && !link.startsWith('//');
}

function Arrow({ direction, onClick, disabled }) {
  const isLeft = direction === 'left';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? 'Əvvəlki reklam' : 'Növbəti reklam'}
      className="absolute top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white text-[#080d4a] shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#26aec4] hover:text-[#080d4a] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#080d4a]"
      style={isLeft ? { left: '-6px' } : { right: '-6px' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isLeft ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export default function AdBoard() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  // GET /ad/all needs a token, so the request is only made for a signed in
  // visitor. Ads saved locally by the admin panel are the fallback, which
  // keeps the board populated for anonymous visitors.
  const { data: apiAds } = useAllAds({ enabled: isUserAuthenticated() });
  const storedAds = useSyncExternalStore(subscribe, getAds, getAds);

  const remoteAds = (apiAds || []).map((ad) => ({
    id: ad.id,
    imageUrl: ad.photoUrl,
    imageFile: '',
    linkUrl: `/reklam/${encodeURIComponent(ad.id)}`,
    alt: ad.title,
  }));

  const ads = remoteAds.length > 0 ? remoteAds : storedAds || [];
  const count = ads.length;

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [count, active]);

  useEffect(() => {
    setFailed({});
  }, [active]);

  useEffect(() => {
    if (count < 2) return undefined;

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + count) % count);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % count);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  if (!count) return null;

  const ad = ads[active];
  const link = ad?.linkUrl || '';
  const image = ad?.imageFile || ad?.imageUrl || '';
  const imageBroken = !image || failed[active];

  const open = () => {
    if (!link) return;
    if (isInternal(link)) navigate(link);
    else window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-[#080d4a] py-6 sm:py-7">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="relative">
          <Arrow
            direction="left"
            disabled={count < 2}
            onClick={() => setActive((i) => (i - 1 + count) % count)}
          />

          <button
            type="button"
            onClick={open}
            disabled={!link}
            className="w-full min-h-[92px] sm:min-h-[116px] rounded-[14px] bg-white flex items-center justify-center px-6 py-5 shadow-[0_8px_26px_rgba(0,0,0,0.28)] transition-all duration-300 hover:shadow-[0_12px_34px_rgba(0,0,0,0.36)] enabled:hover:-translate-y-0.5 disabled:cursor-default"
            aria-label={link ? `Reklam: ${ad?.alt || link}` : 'Reklam'}
          >
            {imageBroken ? (
              <span className="text-[#080d4a]/60 text-[13px] sm:text-[15px] font-accent font-medium text-center px-4">
                {ad?.alt || 'Reklam yoxdur'}
              </span>
            ) : (
              <img
                key={active}
                src={image}
                alt={ad?.alt || 'reklam'}
                className="max-h-[64px] sm:max-h-[86px] max-w-full w-auto object-contain"
                onError={() => setFailed((prev) => ({ ...prev, [active]: true }))}
              />
            )}
          </button>

          <Arrow
            direction="right"
            disabled={count < 2}
            onClick={() => setActive((i) => (i + 1) % count)}
          />
        </div>

        {count > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {ads.map((item, i) => (
              <button
                key={item.id || i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${i + 1}-ci reklam`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === active ? 'w-6 bg-[#26aec4]' : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}