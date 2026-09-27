import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useSyncExternalStore } from 'react';
import CountryFlag from '../CountryFlag';
import { getCountries, subscribe } from '../../store/adminStore';

export default function CountrySearch() {
  const navigate = useNavigate();
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!trimmed) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(trimmed));
  }, [countries, trimmed]);

  const go = (slug) => {
    navigate(`/country/${slug}`);
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trimmed || matches.length === 0) return;

    const exact = matches.find((c) => c.name.toLowerCase() === trimmed);
    go(exact ? exact.slug : matches[0].slug);
  };

  const hasQuery = trimmed.length > 0;
  const notFound = hasQuery && matches.length === 0;

  return (
    <section className="bg-[#080d4a] py-5 sm:py-6">
      <div className="max-w-[720px] mx-auto px-4">
        <form
          className="relative flex items-center gap-2 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-md"
          onSubmit={handleSubmit}
        >
          <svg
            className="w-5 h-5 text-[#080d4a]/50 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
          </svg>

          <input
            type="text"
            placeholder="Search for your dream country"
            aria-label="Ölkə axtarışı"
            className="flex-1 min-w-0 bg-transparent outline-none text-[#323643] text-[13px] sm:text-[14px] font-accent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            type="submit"
            disabled={notFound}
            className="shrink-0 w-[34px] h-[34px] rounded-full bg-[#080d4a] text-white flex items-center justify-center hover:bg-[#141c63] transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Axtar"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l7 7-7 7" />
            </svg>
          </button>

          {hasQuery && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-lg shadow-lg overflow-hidden z-20 text-left">
              {notFound ? (
                <p className="px-4 py-3 text-[13px] text-[#323643]/60">
                  &quot;{query.trim()}&quot; adlı ölkə tapılmadı
                </p>
              ) : (
                <ul role="list" className="max-h-[240px] overflow-y-auto py-1">
                  {matches.map((c) => (
                    <li key={c.slug} role="listitem">
                      <button
                        type="button"
                        onClick={() => go(c.slug)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#f6eeee] transition text-left"
                      >
                        <CountryFlag
                          country={c}
                          className="w-[22px] h-[15px]"
                          emojiClass="text-[16px]"
                        />
                        <span className="text-[#080d4a] text-[13px] font-accent">{c.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>

        {!hasQuery && (
          <ul className="mt-3 flex flex-wrap justify-center gap-2" role="list">
            {countries.slice(0, 8).map((c) => (
              <li key={c.slug} role="listitem">
                <button
                  type="button"
                  onClick={() => go(c.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-[12px] text-white/90 transition"
                >
                  <CountryFlag country={c} className="w-[16px] h-[11px]" emojiClass="text-[13px]" />
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
