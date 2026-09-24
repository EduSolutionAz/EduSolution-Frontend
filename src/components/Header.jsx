import { useState, useSyncExternalStore, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCountries, subscribe } from '../store/adminStore';

const NAV_LINKS = [
  { to: '/login', label: 'Login' },
  { href: '#visa', label: 'Visa Help' },
  { href: '#study', label: 'Study Abroad' },
  { href: '#about', label: 'About Us' },
  { href: '#contact', label: 'Contact us' },
  { href: '#faq', label: 'FAQ' },
];

function Chevron({ open }) {
  return (
    <svg
      className={`w-3 h-3 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCountries, setOpenCountries] = useState(false);
  const [openUnis, setOpenUnis] = useState(false);
  const [mobileCountries, setMobileCountries] = useState(false);
  const [mobileUnis, setMobileUnis] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const cRef = useRef(null);
  const uRef = useRef(null);

  const universities = countries.flatMap((c) =>
    (c.universities || []).map((u) => ({
      id: u.id,
      name: u.name,
      countrySlug: c.slug,
      countryName: c.name,
    })),
  );

  useEffect(() => {
    const onClick = (e) => {
      if (cRef.current && !cRef.current.contains(e.target)) setOpenCountries(false);
      if (uRef.current && !uRef.current.contains(e.target)) setOpenUnis(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const smoothScrollTo = (hash) => {
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      smoothScrollTo(href);
      window.history.pushState(null, '', href);
    }
  };

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

          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] lg:text-[14px] text-white whitespace-nowrap font-accent">
            {/* Countries frame */}
            <div ref={cRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenCountries((v) => !v);
                  setOpenUnis(false);
                }}
                className="inline-flex items-center hover:text-cyan-300 transition cursor-pointer"
              >
                Countries <Chevron open={openCountries} />
              </button>
              {openCountries && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 bg-white rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-[#1a2e5a]/10 overflow-hidden z-50">
                  <div className="max-h-[320px] overflow-y-auto py-1">
                    {countries.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/country/${c.slug}`}
                        onClick={() => setOpenCountries(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-[#1a2e5a] text-[13px] hover:bg-[#f0f4f8] transition"
                      >
                        <span className="text-[16px] leading-none">{c.flag}</span>
                        <span className="font-medium">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Universities frame */}
            <div ref={uRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenUnis((v) => !v);
                  setOpenCountries(false);
                }}
                className="inline-flex items-center hover:text-cyan-300 transition cursor-pointer"
              >
                Universities <Chevron open={openUnis} />
              </button>
              {openUnis && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-[#1a2e5a]/10 overflow-hidden z-50">
                  <div className="max-h-[360px] overflow-y-auto py-1">
                    {universities.length === 0 ? (
                      <div className="px-4 py-6 text-center text-[#1a2e5a]/60 text-[13px]">No universities yet</div>
                    ) : (
                      universities.slice(0, 40).map((u) => (
                        <Link
                          key={u.id}
                          to={`/country/${u.countrySlug}`}
                          onClick={() => setOpenUnis(false)}
                          className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-[#f0f4f8] transition"
                        >
                          <span className="text-[#1a2e5a] text-[13px] font-medium truncate">{u.name}</span>
                          <span className="text-[#1a2e5a]/50 text-[11px] shrink-0">{u.countryName}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="hover:text-cyan-300 transition">
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className="hover:text-cyan-300 transition cursor-pointer"
                >
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
          <nav className="px-4 pb-4 pt-1 flex flex-col gap-1 text-[14px] text-white bg-[#080d4a] border-t border-white/10 font-accent overflow-y-auto max-h-[520px]">
            {/* Mobile Countries */}
            <button
              type="button"
              onClick={() => setMobileCountries((v) => !v)}
              className="flex items-center justify-between py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition text-left"
            >
              <span>Countries</span>
              <Chevron open={mobileCountries} />
            </button>
            {mobileCountries && (
              <div className="ml-2 mb-1 bg-white rounded-lg overflow-hidden">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/country/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[#1a2e5a] text-[13px] border-b border-black/5 last:border-0 hover:bg-[#f0f4f8]"
                  >
                    <span>{c.flag}</span> {c.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Universities */}
            <button
              type="button"
              onClick={() => setMobileUnis((v) => !v)}
              className="flex items-center justify-between py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition text-left"
            >
              <span>Universities</span>
              <Chevron open={mobileUnis} />
            </button>
            {mobileUnis && (
              <div className="ml-2 mb-1 bg-white rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                {universities.slice(0, 30).map((u) => (
                  <Link
                    key={u.id}
                    to={`/country/${u.countrySlug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-[#1a2e5a] text-[13px] border-b border-black/5 last:border-0 hover:bg-[#f0f4f8]"
                  >
                    <span className="truncate">{u.name}</span>
                    <span className="text-[11px] text-[#1a2e5a]/50 shrink-0 ml-2">{u.countryName}</span>
                  </Link>
                ))}
              </div>
            )}

            {NAV_LINKS.map((l) =>
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
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className="py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition cursor-pointer"
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
