import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import CountryFlag from './CountryFlag';
import { getCountries, subscribe } from '../store/adminStore';

const STATIC_LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/login', label: 'Login' },
  { href: '/#services', label: 'Visa Help' },
  { href: '/#study', label: 'Study Abroad' },
  { href: '/#about', label: 'About Us' },
  { href: '/#contact', label: 'Contact us' },
];

export default function Header() {
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [menuOpen, setMenuOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!countriesOpen) return undefined;

    const handlePointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountriesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCountriesOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [countriesOpen]);

  return (
    <header className="relative z-30">
      <div className="bg-[#080d4a]">
        <div className="max-w-[1100px] mx-auto h-[60px] sm:h-[70px] px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/" className="shrink-0" aria-label="EduSolution home">
            <img
              src="/assets/logo.png"
              alt="EduSolution"
              className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[14px] text-white whitespace-nowrap font-accent">
            {countries.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCountriesOpen((v) => !v)}
                  aria-expanded={countriesOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1 hover:text-cyan-300 transition cursor-pointer"
                >
                  Countries
                  <svg
                    width="9"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={`transition-transform ${countriesOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l4 4 4-4" />
                  </svg>
                </button>

                {countriesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] w-[240px] bg-white rounded-lg shadow-xl overflow-hidden py-1 z-20">
                    <ul role="list" className="max-h-[320px] overflow-y-auto">
                      {countries.map((c) => (
                        <li key={c.slug} role="listitem">
                          <Link
                            to={`/country/${c.slug}`}
                            onClick={() => setCountriesOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#080d4a] hover:bg-[#f6eeee] transition"
                          >
                            <CountryFlag
                              country={c}
                              className="w-[20px] h-[14px]"
                              emojiClass="text-[15px]"
                            />
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {STATIC_LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="hover:text-cyan-300 transition">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="hover:text-cyan-300 transition">
                  {l.label}
                </a>
              ),
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded text-white hover:bg-white/10 transition cursor-pointer"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-4 pb-4 pt-1 flex flex-col gap-1 text-[14px] text-white bg-[#080d4a] border-t border-white/10 font-accent">
            {countries.length > 0 && (
              <div className="pb-1 mb-1 border-b border-white/10">
                <span className="block text-[11px] uppercase tracking-wide text-white/40 px-2 pb-1">
                  Countries
                </span>
                <ul className="grid grid-cols-2 gap-x-2" role="list">
                  {countries.map((c) => (
                    <li key={c.slug} role="listitem">
                      <Link
                        to={`/country/${c.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition"
                      >
                        <CountryFlag
                          country={c}
                          className="w-[18px] h-[13px]"
                          emojiClass="text-[13px]"
                        />
                        <span className="truncate">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {STATIC_LINKS.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition"
                >
                  {l.label}
                </a>
              ),
            )}
          </nav>
        </div>
      </div>

      <div className="bg-[#26aec4] px-3 py-1.5 sm:py-0 sm:h-[21px] flex items-center justify-center text-center">
        <p className="text-white text-[10px] sm:text-[11px] leading-snug tracking-wide max-w-[1100px]">
          Find universities, visa information, tuition fees and admission requirements for your dream country.
        </p>
      </div>
    </header>
  );
}
