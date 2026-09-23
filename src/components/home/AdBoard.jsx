import { useSyncExternalStore } from 'react';
import { getAds, subscribe } from '../../store/adminStore';

export default function AdBoard() {
  const ads = useSyncExternalStore(subscribe, getAds, getAds);

  if (!ads.length) return null;

  return (
    <section className="bg-[#080d4a] py-5 sm:py-6">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {ads.map((ad) => (
            <a
              key={ad.id}
              href={ad.linkUrl || '#'}
              target={ad.linkUrl ? '_blank' : '_self'}
              rel={ad.linkUrl ? 'noopener noreferrer' : undefined}
              className="shrink-0 block"
            >
              <img
                src={ad.imageUrl}
                alt={ad.alt || 'ad'}
                className="h-14 w-auto object-contain rounded hover:opacity-85 transition"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
