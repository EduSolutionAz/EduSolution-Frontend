import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createPassword, login, register, verifyCode } from '../services/authApi';

const EMAIL_RE = /^[^\s@]+@[^\s]+\.[^\s]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{9,20}$/;

const LIMITS = {
  EMAIL_MAX: 50,
  NAME_MAX: 50,
  PHONE_MIN: 12,
  PHONE_MAX: 15,
  CODE_LENGTH: 6,
  PASSWORD_MIN: 9,
  PASSWORD_MAX: 20,
};

const FIELD_BASE =
  'w-full h-[44px] sm:h-[32px] bg-transparent border rounded-[4px] sm:rounded-[2px] text-white text-[13px] sm:text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90';

const INPUT_BASE =
  'w-full h-[40px] bg-transparent border border-white/60 rounded-[3px] text-white text-[13px] px-3 outline-none placeholder-white/70 focus:border-cyan-300';

const LABEL_BASE = 'block text-[11px] text-white/80 mb-1.5 font-accent';

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [registerStep, setRegisterStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    name: '',
    phone: '',
    code: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const validate = () => {
    const next = {};

    if (isLogin) {
      const value = formData.identifier.trim();
      if (!value) {
        next.identifier = 'Email və ya telefon tələb olunur';
      } else if (value.includes('@') && !EMAIL_RE.test(value)) {
        next.identifier = 'Yanlış email formatı';
      } else if (value.includes('@') && value.length > LIMITS.EMAIL_MAX) {
        next.identifier = `Email ${LIMITS.EMAIL_MAX} simvoldan uzun ola bilməz`;
      } else if (!value.includes('@') && !PHONE_RE.test(value)) {
        next.identifier = 'Yanlış telefon formatı';
      }
    } else {
      if (!EMAIL_RE.test(formData.email.trim())) {
        next.email = 'Düzgün email formatı daxil edin';
      } else if (formData.email.trim().length > LIMITS.EMAIL_MAX) {
        next.email = `Email ${LIMITS.EMAIL_MAX} simvoldan uzun ola bilməz`;
      }

      if (registerStep === 1) {
        if (!formData.name.trim()) {
          next.name = 'Ad tələb olunur';
        } else if (formData.name.trim().length > LIMITS.NAME_MAX) {
          next.name = `Ad ${LIMITS.NAME_MAX} simvoldan uzun ola bilməz`;
        }

        const phone = formData.phone.trim();
        if (!phone) {
          next.phone = 'Telefon tələb olunur';
        } else if (phone.replace(/[^0-9]/g, '').length < LIMITS.PHONE_MIN) {
          next.phone = `Telefon minimum ${LIMITS.PHONE_MIN} rəqəm olmalıdır`;
        } else if (phone.length > LIMITS.PHONE_MAX) {
          next.phone = `Telefon maksimum ${LIMITS.PHONE_MAX} simvol olmalıdır`;
        }
      }

      if (registerStep === 2) {
        const code = formData.code.trim();
        if (!code) {
          next.code = 'Təsdiq kodu tələb olunur';
        } else if (code.length !== LIMITS.CODE_LENGTH) {
          next.code = `Kod ${LIMITS.CODE_LENGTH} rəqəm olmalıdır`;
        }
      }
    }

    const password = formData.password;
    if (!password.trim()) {
      next.password = 'Şifrə tələb olunur';
    } else if (password.length < LIMITS.PASSWORD_MIN) {
      next.password = `Şifrə minimum ${LIMITS.PASSWORD_MIN} simvol olmalıdır`;
    } else if (password.length > LIMITS.PASSWORD_MAX) {
      next.password = `Şifrə maksimum ${LIMITS.PASSWORD_MAX} simvol olmalıdır`;
    }

    return next;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const identifier = formData.identifier.trim();
        await login({ email: identifier, password: formData.password });
        navigate(location.state?.from || '/');
        return;
      }

      const email = formData.email.trim();

      if (registerStep === 1) {
        const data = await register({
          email,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });
        setRegisterStep(2);
        setNotice(
          data?.is_code_sent
            ? `Təsdiq kodu ${email} ünvanına göndərildi.`
            : 'Kod göndərilmədi, yenidən cəhd edin.',
        );
        return;
      }

      if (registerStep === 2) {
        const data = await verifyCode({ email, code: formData.code.trim() });
        if (data?.is_verified === false) {
          setFormError(data?.message || 'Kod təsdiqlənmədi. Yenidən yoxlayın.');
          return;
        }
        setRegisterStep(3);
        setNotice('Kod təsdiqləndi. İndi şifrənizi təyin edin.');
        return;
      }

      await createPassword({ email, password: formData.password });
      switchMode('login');
      setFormData((prev) => ({ ...prev, identifier: email }));
      setNotice('Hesab yaradıldı. İndi giriş edə bilərsiniz.');
      navigate('/login', { replace: true });
    } catch (error) {
      const fieldErrors = error?.errors || [];
      if (fieldErrors.length > 0) {
        setFormError(fieldErrors[0].message);
      } else {
        setFormError(error?.message || 'Xəta baş verdi. Yenidən cəhd edin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError('');
    setNotice('');
    setRegisterStep(1);
    setFormData({ identifier: '', email: '', name: '', phone: '', code: '', password: '' });
  };

  const backToStep1 = () => {
    setRegisterStep(1);
    setErrors({});
    setFormError('');
  };

  const iconClass = 'w-[16px] h-[16px]';
  const iconWrap = 'absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none';

  const fieldErrorClass = (hasError) =>
    `${FIELD_BASE} ${hasError ? 'border-red-400' : 'border-white focus:border-cyan-300'}`;

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
          className="relative w-full max-w-[720px] flex flex-col sm:block sm:h-[420px] overflow-hidden rounded shadow-[0_12px_28px_rgba(0,0,0,0.20)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-shadow duration-700"
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
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77,0,0.175,1) both' }}
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
                      placeholder="Email"
                      aria-label="Email"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={fieldErrorClass(errors.identifier)}
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
                      className={fieldErrorClass(errors.password)}
                    />
                    {errors.password && (
                      <p className="text-red-300 text-[10px] mt-1 pl-[45px]">{errors.password}</p>
                    )}
                  </div>

                  {formError && <p className="text-red-300 text-[11px] text-center">{formError}</p>}
                  {notice && <p className="text-cyan-200 text-[11px] text-center">{notice}</p>}

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
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77,0,0.175,1) both' }}
              >
                <h2 className="text-[24px] sm:text-[22px] font-semibold mb-1 tracking-wide">Register</h2>
                <p className="text-[10px] text-white/60 mb-4">
                  Step {registerStep} of 3
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:gap-[12px]">
                  <div>
                    <label className={LABEL_BASE} htmlFor="reg-email">
                      Email *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={registerStep > 1}
                      className={`${INPUT_BASE} ${errors.email ? 'border-red-400' : ''} disabled:opacity-60`}
                    />
                    {errors.email && <p className="text-red-300 text-[10px] mt-1">{errors.email}</p>}
                  </div>

                  {registerStep === 1 && (
                    <>
                      <div>
                        <label className={LABEL_BASE} htmlFor="reg-name">
                          Name and Surname *
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          name="name"
                          placeholder="Name and Surname"
                          value={formData.name}
                          onChange={handleChange}
                          className={`${INPUT_BASE} ${errors.name ? 'border-red-400' : ''}`}
                        />
                        {errors.name && <p className="text-red-300 text-[10px] mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className={LABEL_BASE} htmlFor="reg-phone">
                          Phone Number *
                        </label>
                        <input
                          id="reg-phone"
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`${INPUT_BASE} ${errors.phone ? 'border-red-400' : ''}`}
                        />
                        {errors.phone && <p className="text-red-300 text-[10px] mt-1">{errors.phone}</p>}
                      </div>
                    </>
                  )}

                  {registerStep === 2 && (
                    <div>
                      <label className={LABEL_BASE} htmlFor="reg-code">
                        Verification Code *
                      </label>
                      <input
                        id="reg-code"
                        type="text"
                        inputMode="numeric"
                        name="code"
                        maxLength={LIMITS.CODE_LENGTH}
                        placeholder="6-digit code"
                        value={formData.code}
                        onChange={handleChange}
                        className={`${INPUT_BASE} ${errors.code ? 'border-red-400' : ''}`}
                      />
                      {errors.code && <p className="text-red-300 text-[10px] mt-1">{errors.code}</p>}
                    </div>
                  )}

                  {registerStep === 3 && (
                    <div>
                      <label className={LABEL_BASE} htmlFor="reg-pass">
                        Create Password *
                      </label>
                      <input
                        id="reg-pass"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${INPUT_BASE} ${errors.password ? 'border-red-400' : ''}`}
                      />
                      {errors.password && (
                        <p className="text-red-300 text-[10px] mt-1">{errors.password}</p>
                      )}
                    </div>
                  )}

                  {formError && <p className="text-red-300 text-[11px] text-center">{formError}</p>}
                  {notice && <p className="text-cyan-200 text-[11px] text-center">{notice}</p>}

                  <div className="flex items-center justify-center gap-3 pt-1">
                    {registerStep > 1 && (
                      <button
                        type="button"
                        onClick={registerStep === 2 ? backToStep1 : () => setRegisterStep(2)}
                        className="text-white/60 hover:text-white text-[11px] underline cursor-pointer"
                      >
                        Geri
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[130px] h-[38px] sm:w-[88px] sm:h-[25px] bg-white text-[#080d4a] rounded-full text-[13px] sm:text-[10px] font-accent font-semibold hover:bg-gray-200 transition-all hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Göndərilir...' : registerStep === 3 ? 'Finish' : 'Continue'}
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
