import { Link } from 'react-router-dom';
import { useCountriesWithUniversities } from '../../services/contentHooks';
import { formatUniversityCount, formatUsd, universityInitials } from '../../utils/format';

const FLAG_MAP = {
  germany: 'de',
  turkiye: 'tr',
  poland: 'pl',
  latvia: 'lv',
  italy: 'it',
  spain: 'es',
  'czech-republic': 'cz',
  'united-kingdom': 'gb',
  america: 'us',
};

export default function WorkingWith() {
  const { data } = useCountriesWithUniversities();
  const countries = data || [];

  return (
    <section
      id="study"
      className="py-6 sm:py-8 pb-10"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Cards grid - 4 per row like screenshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" role="list">
          {countries.map((c) => (
            <Link
              key={c.slug}
              to={`/country/${c.slug}`}
              role="listitem"
              className="group relative overflow-hidden rounded-[22px] h-[148px] sm:h-[160px] flex flex-col justify-between p-3 sm:p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-all duration-300"
            >
              {/* background image */}
              <div className="absolute inset-0 bg-[#1a2e5a]">
                {c.heroImage && (
                  <img
                    src={c.heroImage}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20 group-hover:from-black/80 group-hover:via-black/45 transition" />
              </div>

              {/* content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-white font-heading font-bold text-[13px] sm:text-[15px] text-center tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {c.name}
                </h3>

                <ul className="mt-1.5 space-y-0.5 text-white text-[10px] leading-[1.4] font-semibold w-fit mx-auto text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                    {formatUniversityCount(c.card?.universityCount)}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                    {formatUsd(c.card?.tuitionFee)}
                  </li>
                  {(c.card?.features || []).map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto pt-2 text-white text-[10px] font-accent font-bold underline underline-offset-2 decoration-white/60 group-hover:decoration-white text-center block drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  learn more
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Working With title + flags */}
        <div className="mt-8 sm:mt-10 text-center">
          <h2 className="text-[#1a2e5a] font-heading font-bold text-[19px] sm:text-[22px] tracking-wide">Working With</h2>
          <div className="mt-3 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap max-w-[560px] mx-auto">
            {countries.map((c) => {
              const code = FLAG_MAP[c.slug];
              const apiFlag = c.flag;

              return (
                <div
                  key={`flag-${c.slug}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] shrink-0 bg-[#1a2e5a]"
                  title={c.name}
                >
                  {apiFlag || code ? (
                    <img
                      src={apiFlag || `https://flagcdn.com/w80/${code}.png`}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}

                  <div
                    className={`w-full h-full flex items-center justify-center text-white font-heading font-bold text-[13px] leading-none ${
                      apiFlag || code ? 'hidden' : ''
                    }`}
                  >
                    {universityInitials(c.name)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
