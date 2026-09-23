import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const navLinks = [
    { href: '#visa', label: 'Visa Help' },
    { href: '#study', label: 'Study Abroad' },
    { href: '#about', label: 'About Us' },
    { href: '#contact', label: 'Contact us' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email tələb olunur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Yanlış email formatı';
    }
    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = 'Telefon tələb olunur';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Şifrə tələb olunur';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifrə minimum 6 simvol olmalı';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const redirect = location.state?.from || '/';
      if (isLogin) {
        navigate(redirect);
      } else {
        setMode('login');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] text-white font-sans overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header className="relative z-30">
        <div className="bg-[#080d4a]">
          <div className="max-w-[1100px] mx-auto h-[60px] sm:h-[70px] px-4 sm:px-6 flex items-center justify-between gap-3">
            <a href="/" className="shrink-0">
              <img
                src="/assets/logo.png"
                alt="EduSolution"
                className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] object-contain"
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 text-[14px] whitespace-nowrap">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className="hover:text-cyan-300 transition">
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-white/10 transition cursor-pointer"
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

          {/* Mobile dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="px-4 pb-4 pt-1 flex flex-col gap-1 text-[14px] bg-[#080d4a] border-t border-white/10">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-2 rounded hover:bg-white/10 hover:text-cyan-300 transition"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-[#26aec4] px-3 py-1.5 sm:py-0 sm:h-[21px] flex items-center justify-center text-center">
          <p className="text-[10px] sm:text-[11px] leading-snug tracking-wide max-w-[1100px]">
            Find universities, visa information, tuition fees and admission requirements for your dream country.
          </p>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main
        className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(246,238,238,0.90), rgba(246,238,238,0.90)),
            url('/assets/topographic.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div
          className="relative w-full max-w-[720px] flex flex-col sm:block sm:h-[380px] overflow-hidden rounded shadow-[0_12px_28px_rgba(0,0,0,0.20)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-shadow duration-700"
          style={{ borderRadius: '6px', backgroundColor: '#080d4a' }}
        >
          {/* ================= WORLD MAP ================= */}
          <div
            className={`order-1 relative h-[190px] w-full sm:absolute sm:top-0 sm:bottom-0 sm:h-full sm:w-[48%] sm:order-none z-0 transition-all duration-[800ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
              isLogin ? 'sm:left-0' : 'sm:left-[52%]'
            }`}
            style={{
              backgroundImage: "url('/assets/world-map.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#080d4a] to-transparent sm:hidden" />
          </div>

          {/* ================= FORM PANEL ================= */}
          <div
            className={`order-2 relative w-full sm:absolute sm:top-0 sm:bottom-0 sm:h-full sm:w-[52%] sm:order-none flex flex-col items-center justify-center z-10 px-5 py-8 min-[400px]:px-8 sm:p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
              isLogin ? 'sm:left-[52%]' : 'sm:left-0'
            }`}
            style={{
              backgroundColor: '#080d4a',
              backgroundImage: `
                linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)),
                url('/assets/topographic.png')
              `,
              backgroundSize: '650px auto',
              backgroundPosition: 'center',
            }}
          >
            {isLogin ? (
              <div
                key="login-form"
                className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[270px]"
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77, 0, 0.175, 1) both' }}
              >
                <h2 className="text-[24px] sm:text-[22px] font-semibold mb-5 tracking-wide">Login</h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:gap-[12px]">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email or Phone Number"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 ${
                        errors.email ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.email}</p>}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 ${
                        errors.password ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.password && <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.password}</p>}
                  </div>
                  <div className="flex justify-center pt-2 sm:pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[130px] h-[38px] sm:w-[88px] sm:h-[25px] bg-white text-[#080d4a] rounded-full text-[13px] sm:text-[10px] font-accent font-semibold hover:bg-gray-200 transition-all hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Göndəlir...' : 'Login'}
                    </button>
                  </div>
                  <p className="text-[12px] sm:text-[10px] text-center mt-1">
                    If you don&apos;t have any account,{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-cyan-300 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)] transition-all cursor-pointer font-medium"
                    >
                      click here
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              <div
                key="register-form"
                className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[270px]"
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77, 0, 0.175, 1) both' }}
              >
                <h2 className="text-[24px] sm:text-[22px] font-semibold mb-5 tracking-wide">Register</h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:gap-[12px]">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 ${
                        errors.email ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.email}</p>}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 2c1.5 3 3 4.5 6 6l2-2 5 2v3c0 1-1 1-2 1C10.5 21 3 13.5 3 5c0-1 .5-1 2-1z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 ${
                        errors.phone ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.phone}</p>}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 ${
                        errors.password ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.password && <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.password}</p>}
                  </div>
                  <div className="flex justify-center pt-2 sm:pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[130px] h-[38px] sm:w-[88px] sm:h-[25px] bg-white text-[#080d4a] rounded-full text-[13px] sm:text-[10px] font-accent font-semibold hover:bg-gray-200 transition-all hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Göndəlir...' : 'Register'}
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-[8px] text-center leading-4 sm:leading-3 mt-1 px-2 sm:px-0">
                    By clicking register, you are accepting our{' '}
                    <a href="#terms" className="underline text-cyan-300">
                      terms and conditions
                    </a>
                  </p>
                  <p className="text-[12px] sm:text-[10px] text-center mt-1">
                    If you already have any account,{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-cyan-300 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)] transition-all cursor-pointer font-medium"
                    >
                      click here
                    </button>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#080d4a]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-7 pb-7 sm:pt-7 sm:pb-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center text-center order-[-1] sm:order-none sm:col-start-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="ES" className="w-[25px] h-[25px] object-contain" />
              <span className="text-[14px] italic font-medium whitespace-nowrap">EduSolution Academy</span>
            </div>
            <p className="text-[11px] sm:text-[10px] leading-5 sm:leading-4 max-w-[280px] sm:max-w-[230px] mt-2 text-white/90">
              Find universities, visa information, tuition fees and admission requirements for your dream country.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start sm:col-start-1 sm:row-start-1">
            <h3 className="text-[14px] italic mb-2">Site Map</h3>
            <div className="flex flex-row sm:flex-col flex-wrap justify-center gap-x-5 gap-y-1.5 sm:gap-1 text-[13px] sm:text-[12px]">
              <a href="#about" className="hover:text-cyan-300 transition">About Us</a>
              <a href="#study" className="hover:text-cyan-300 transition">Study Abroad</a>
              <a href="#visa" className="hover:text-cyan-300 transition">Visa Help</a>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <h3 className="text-[14px] italic mb-3 sm:mb-4">Our Social Media Accounts</h3>
            <div className="flex gap-3 justify-center sm:justify-end">
              <a href="#linkedin" aria-label="LinkedIn" className="hover:text-cyan-300 transition p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="hover:text-cyan-300 transition p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="hover:text-cyan-300 transition p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.9V8.1l6.5 3.9-6.5 3.9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
