import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{6,20}$/;

const FIELD_BASE =
  'w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90';

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const validate = () => {
    const newErrors = {};

    if (isLogin) {
      const value = formData.identifier.trim();
      if (!value) {
        newErrors.identifier = 'Email və ya telefon tələb olunur';
      } else if (value.includes('@') && !EMAIL_RE.test(value)) {
        newErrors.identifier = 'Yanlış email formatı';
      } else if (!value.includes('@') && !PHONE_RE.test(value)) {
        newErrors.identifier = 'Yanlış telefon formatı';
      }
    } else {
      if (!EMAIL_RE.test(formData.email.trim())) {
        newErrors.email = 'Düzgün email formatı daxil edin';
      }
      if (!PHONE_RE.test(formData.phone.trim())) {
        newErrors.phone = 'Düzgün telefon formatı daxil edin';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Şifrə tələb olunur';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifrə minimum 6 simvol olmalı';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isLogin) {
        navigate(location.state?.from || '/');
      } else {
        setMode('login');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormData({ identifier: '', email: '', phone: '', password: '' });
  };

  const iconClass = 'w-[16px] h-[16px]';
  const iconWrap = 'absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none';

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />

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

          <div
            className={`order-2 relative w-full sm:absolute sm:top-0 sm:bottom-0 sm:h-full sm:w-[52%] sm:order-none flex flex-col items-center justify-center z-10 px-5 py-8 min-[400px]:px-8 sm:p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.77, 0, 0.175, 1)] ${
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
                    <span className={iconWrap}>
                      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="identifier"
                      placeholder="Email or Phone Number"
                      aria-label="Email or Phone Number"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={`${FIELD_BASE} ${
                        errors.identifier ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.identifier && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.identifier}</p>
                    )}
                  </div>

                  <div className="relative">
                    <span className={iconWrap}>
                      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      aria-label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${FIELD_BASE} ${
                        errors.password ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex justify-center pt-2 sm:pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[130px] h-[38px] sm:w-[88px] sm:h-[25px] bg-white text-[#080d4a] rounded-full text-[13px] sm:text-[10px] font-accent font-semibold hover:bg-gray-200 transition-all hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Göndərilir...' : 'Login'}
                    </button>
                  </div>

                  <p className="text-[12px] sm:text-[10px] text-center mt-1">
                    If you don&apos;t have any account,{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
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
                    <span className={iconWrap}>
                      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      aria-label="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${FIELD_BASE} ${
                        errors.email ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <span className={iconWrap}>
                      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 2c1.5 3 3 4.5 6 6l2-2 5 2v3c0 1-1 1-2 1C10.5 21 3 13.5 3 5c0-1 .5-1 2-1z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      aria-label="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${FIELD_BASE} ${
                        errors.phone ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.phone}</p>
                    )}
                  </div>

                  <div className="relative">
                    <span className={iconWrap}>
                      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      aria-label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${FIELD_BASE} ${
                        errors.password ? 'border-red-400' : 'border-white focus:border-cyan-300'
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex justify-center pt-2 sm:pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[130px] h-[38px] sm:w-[88px] sm:h-[25px] bg-white text-[#080d4a] rounded-full text-[13px] sm:text-[10px] font-accent font-semibold hover:bg-gray-200 transition-all hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Göndərilir...' : 'Register'}
                    </button>
                  </div>

                  <p className="text-[12px] sm:text-[10px] text-center mt-1">
                    If you already have any account,{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
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

        <p className="mt-4 text-[12px] text-[#080d4a]/60">
          <Link to="/" className="hover:underline">
            ← Ana səhifəyə qayıt
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
