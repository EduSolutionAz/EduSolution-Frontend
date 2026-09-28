import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTopCountries } from '../../services/contentHooks';
import { mapTopCountry } from '../../services/mappers';

export default function CountrySearch() {
  const navigate = useNavigate();
  const { data } = useTopCountries();
  const countries = (data || []).map(mapTopCountry).filter(Boolean);
  const [query, setQuery] = useState('');
  const [notFound, setNotFound] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;

    const exact = countries.find((c) => c.name.toLowerCase() === term);
    const partial = countries.find((c) => c.name.toLowerCase().includes(term));

    const match = exact || partial;
    if (match) {
      setNotFound('');
      navigate(`/country/${match.slug}`);
      return;
    }

    setNotFound(`"${query.trim()}" tapılmadı`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (notFound) setNotFound('');
  };

  return (
    <section
      className="py-5 sm:py-6"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[420px] mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#dbe6eb]/90 rounded-full pl-3.5 pr-1.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#1a2e5a]/10">
          <svg className="w-4 h-4 text-[#1a2e5a]/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search for your dream country"
            className="flex-1 bg-transparent outline-none text-[#1a2e5a] placeholder:text-[#1a2e5a]/50 text-[12px] sm:text-[13px] font-accent"
            list="country-options"
            value={query}
            onChange={handleChange}
          />
          <datalist id="country-options">
            {countries.map((c) => (
              <option key={c.slug} value={c.name} />
            ))}
          </datalist>
          <button type="submit" aria-label="Axtar" className="hidden" />
        </form>

        {notFound && (
          <p className="text-center text-[#1a2e5a]/70 text-[12px] mt-2.5">{notFound}</p>
        )}
      </div>
    </section>
  );
}
