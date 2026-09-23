import { useNavigate } from 'react-router-dom';
import { useState, useSyncExternalStore } from 'react';
import { getCountries, subscribe } from '../../store/adminStore';

export default function CountrySearch() {
  const navigate = useNavigate();
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = countries.find(
      (c) =>
        c.name.toLowerCase() === query.trim().toLowerCase()
    );
    if (match) {
      navigate(`/country/${match.slug}`);
    } else if (query.trim()) {
      navigate(`/country/${query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    }
  };

  return (
    <section className="bg-[#080d4a] py-5 sm:py-6">
      <div className="max-w-[720px] mx-auto px-4">
        <form
          className="flex items-center gap-2 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-md"
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
            className="flex-1 bg-transparent outline-none text-[#323643] text-[13px] sm:text-[14px] font-accent"
            list="country-options"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <datalist id="country-options">
            {countries.map((c) => (
              <option key={c.slug} value={c.name} />
            ))}
          </datalist>
          <button
            type="submit"
            className="shrink-0 w-[34px] h-[34px] rounded-full bg-[#080d4a] text-white flex items-center justify-center hover:bg-[#141c63] transition"
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
        </form>
      </div>
    </section>
  );
}
