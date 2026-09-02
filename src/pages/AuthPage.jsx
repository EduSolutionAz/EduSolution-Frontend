import React, { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form məlumatları:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] text-white font-sans">

      {/* ================= HEADER ================= */}
      <header className="relative z-20">
        <div className="h-[70px] bg-[#080d4a]">
          <div className="max-w-[1100px] mx-auto h-full px-6 flex items-center justify-between">
            <img src="/assets/logo.png" alt="EduSolution" className="w-[48px] h-[48px] object-contain" />
            <nav className="flex items-center gap-7 text-[14px]">
              <a href="#visa" className="hover:text-cyan-300 transition">Visa Help</a>
              <a href="#study" className="hover:text-cyan-300 transition">Study Abroad</a>
              <a href="#about" className="hover:text-cyan-300 transition">About Us</a>
              <a href="#contact" className="hover:text-cyan-300 transition">Contact us</a>
            </nav>
          </div>
        </div>
        <div className="h-[21px] bg-[#26aec4] flex items-center justify-center">
          <p className="text-[11px] tracking-wide">
            Find universities, visa information, tuition fees and admission requirements for your dream country.
          </p>
        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main
        className="relative flex-1 flex items-center justify-center overflow-hidden py-10"
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
          className="relative w-[720px] h-[360px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.20)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-shadow duration-700"
          style={{ borderRadius: '4px' }}
        >

          {/* ================= WORLD MAP ================= */}
          <div
            className="absolute top-0 h-full w-[48%] z-0"
            style={{
              left: isLogin ? '52%' : '0%',
              transform: isLogin ? 'scale(1) translate-x-0' : 'scale(1.05) translate-x-0)',
              backgroundImage: "url('/assets/world-map.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'left 800ms cubic-bezier(0.77, 0, 0.175, 1), transform 1000ms cubic-bezier(0.77, 0, 0.175, 1), opacity 600ms ease',
              opacity: 1,
            }}
          />

          {/* ================= FORM PANEL ================= */}
          <div
            className="absolute top-0 h-full w-[52%] flex flex-col items-center justify-center z-10"
            style={{
              left: isLogin ? '0%' : '48%',
              backgroundImage: `
                linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)),
                url('/assets/topographic.png')
              `,
              backgroundSize: '650px auto',
              backgroundPosition: 'center',
              transition: 'left 800ms cubic-bezier(0.77, 0, 0.175, 1)',
            }}
          >
            {isLogin ? (
              <div
                key="login-form"
                className="flex flex-col items-center"
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77, 0, 0.175, 1) both' }}
              >
                <h2 className="text-[22px] font-semibold mb-5 tracking-wide">Login</h2>
                <form onSubmit={handleSubmit} className="w-[270px] flex flex-col gap-[12px]">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input type="text" name="email" placeholder="Email or Phone Number" value={formData.email} onChange={handleChange} required
                      className="w-full h-[32px] bg-transparent border border-white rounded-[2px] text-white text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 focus:border-cyan-300" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
                      className="w-full h-[32px] bg-transparent border border-white rounded-[2px] text-white text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 focus:border-cyan-300" />
                  </div>
                  <div className="flex justify-center pt-1">
                    <button type="submit" className="w-[88px] h-[25px] bg-white text-[#080d4a] rounded-full text-[10px] font-semibold hover:bg-gray-200 transition-all hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer">Login</button>
                  </div>
                  <p className="text-[10px] text-center mt-1">
                    If you don't have any account,{' '}
                    <button type="button" onClick={() => setMode('register')} className="text-cyan-300 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)] transition-all cursor-pointer">click here</button>
                  </p>
                </form>
              </div>
            ) : (
              <div
                key="register-form"
                className="flex flex-col items-center"
                style={{ animation: 'fadeSlide 700ms cubic-bezier(0.77, 0, 0.175, 1) both' }}
              >
                <h2 className="text-[22px] font-semibold mb-5 tracking-wide">Register</h2>
                <form onSubmit={handleSubmit} className="w-[270px] flex flex-col gap-[12px]">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </span>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
                      className="w-full h-[32px] bg-transparent border border-white rounded-[2px] text-white text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 focus:border-cyan-300" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 2c1.5 3 3 4.5 6 6l2-2 5 2v3c0 1-1 1-2 1C10.5 21 3 13.5 3 5c0-1 .5-1 2-1z" />
                      </svg>
                    </span>
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required
                      className="w-full h-[32px] bg-transparent border border-white rounded-[2px] text-white text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 focus:border-cyan-300" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
                      className="w-full h-[32px] bg-transparent border border-white rounded-[2px] text-white text-[11px] pl-[45px] pr-3 outline-none placeholder-white placeholder-opacity-90 focus:border-cyan-300" />
                  </div>
                  <div className="flex justify-center pt-1">
                    <button type="submit" className="w-[88px] h-[25px] bg-white text-[#080d4a] rounded-full text-[10px] font-semibold hover:bg-gray-200 transition-all hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer">Register</button>
                  </div>
                  <p className="text-[8px] text-center leading-3 mt-1">
                    By clicking register, you are accepting our{' '}
                    <a href="#terms" className="underline text-cyan-300">terms and conditions</a>
                  </p>
                  <p className="text-[10px] text-center mt-[-2px]">
                    If you already have any account,{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-cyan-300 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)] transition-all cursor-pointer">click here</button>
                  </p>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>


      {/* ================= FOOTER ================= */}
      <footer className="bg-[#080d4a] min-h-[155px]">
        <div className="max-w-[1100px] mx-auto px-8 pt-7 grid grid-cols-3">

          <div>
            <h3 className="text-[14px] italic mb-2">Site Map</h3>
            <div className="flex flex-col gap-1 text-[12px]">
              <a href="#about" className="hover:text-cyan-300 transition">About Us</a>
              <a href="#study" className="hover:text-cyan-300 transition">Study Abroad</a>
              <a href="#visa" className="hover:text-cyan-300 transition">Visa Help</a>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="ES" className="w-[25px] h-[25px] object-contain" />
              <span className="text-[14px] italic font-medium">EduSolution Academy</span>
            </div>
            <p className="text-[10px] leading-4 max-w-[230px] mt-2">
              Find universities, visa information, tuition fees and admission requirements for your dream country.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <h3 className="text-[14px] italic mb-4">Our Social Media Accounts</h3>
            <div className="flex gap-4">
              <a href="#linkedin" aria-label="LinkedIn" className="hover:text-cyan-300 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-9.5 15.5H6.8v-7h2.7v7zM8.15 10.5A1.6 1.6 0 1 1 8.15 7.3a1.6 1.6 0 0 1 0 3.2zM19 18.5h-2.7v-3.8c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2v3.9h-2.7v-7h2.6v1c.4-.7 1.1-1.2 2.4-1.2 2.6 0 3.2 1.7 3.2 3.9v3.3z" />
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="hover:text-cyan-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.9V8.1l6.5 3.9-6.5 3.9z" />
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="hover:text-cyan-300 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
