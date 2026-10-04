import { Link } from 'react-router-dom';
import { PROMO_ADS } from '../../pages/AdPage';

export default function PromoBanner() {
  return (
    <section
      className="py-7 sm:py-9"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {PROMO_ADS.map((ad) => (
            <Link
              key={ad.id}
              to={`/reklam/${ad.id}`}
              className="block aspect-square overflow-hidden bg-[#fdf6f3] rounded-[6px] shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-[#1a2e5a]/10 cursor-pointer group"
            >
              <img
                src={ad.src}
                alt={ad.alt}
                className="w-full h-full object-cover select-none transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                draggable="false"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}