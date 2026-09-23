import { Link } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import { getCountries, subscribe } from '../../store/adminStore';

export default function WorkingWith() {
  const countries = useSyncExternalStore(
    subscribe,
    getCountries,
    getCountries,
  );

  return (
    <section className="bg-[#080d4a] py-10 sm:py-14">
      <div className="max-w-[1100px] mx-auto px-4">
        <h2 className="text-center text-[#e2eeff] font-heading font-bold text-[24px] sm:text-[30px] tracking-wide mb-8 sm:mb-10">
          Working With
        </h2>

        <div
          className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3.5"
          role="list"
        >
          {countries.map((c) => (
            <div
              key={c.slug}
              role="listitem"
              className="bg-[#0a1145] border border-white/5 rounded-md px-5 py-4 flex flex-col hover:bg-[#121b63] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[22px] leading-none">{c.flag || ''}</span>
                <h3 className="text-[#f7f7f7] font-accent font-semibold text-[15px]">
                  {c.name}
                </h3>
              </div>

              <ul className="space-y-1 mb-3.5 text-[#f7f7f7] text-[12.5px] font-light">
                <li className="text-[#e2eeff] font-accent font-medium">
                  {c.card?.universityCount || ''}
                </li>
                <li>{c.card?.tuitionTag || ''}</li>
                {(c.card?.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <Link
                to={`/country/${c.slug}`}
                className="mt-auto inline-flex items-center gap-1 text-[#e2eeff] text-[12.5px] font-accent font-medium hover:text-white hover:gap-1.5 transition-all"
              >
                learn more
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6l6 6-6 6"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
