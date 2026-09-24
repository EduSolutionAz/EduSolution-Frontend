import { heroStats } from "../../data/home";

function StudentsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#1d3557" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="11" r="6" />
      <path d="M7 27c1.2-5 6-8 10-8s8.8 3 10 8" />
      <circle cx="17" cy="11" r="2.2" fill="#1d3557" stroke="none" opacity="0.12" />
    </svg>
  );
}
function UniversityIcon() {
  return (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none" stroke="#1d3557" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="18" width="32" height="3" />
      <rect x="4" y="21" width="28" height="2.5" />
      <path d="M8 18V11h3v7M14.5 18V9h3v9M22 18v-7h3v7" />
      <path d="M6 11 L9.5 7 L13 11 M13 9 L16 5.5 L19 9 M21 11 L24.5 7 L28 11" />
      <rect x="7" y="13.2" width="2" height="2" fill="#1d3557" stroke="none" />
      <rect x="15.5" y="11.2" width="2" height="2" fill="#1d3557" stroke="none" />
      <rect x="23" y="13.2" width="2" height="2" fill="#1d3557" stroke="none" />
      <circle cx="17.5" cy="26" r="1" fill="#1d3557" stroke="none" />
    </svg>
  );
}
function VisaIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#1d3557" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="16" height="20" rx="1.5" />
      <rect x="11" y="3" width="16" height="20" rx="1.5" fill="#e8f2f5" stroke="#1d3557" />
      <path d="M15 11l2 2 5-5" strokeWidth="1.8" />
      <path d="M15 17h9M15 21h9" strokeWidth="1.3" />
      <circle cx="24" cy="13" r="1.2" fill="#1d3557" stroke="none" />
    </svg>
  );
}

const ICONS = {
  "Students Helped": <StudentsIcon />,
  "Partner University": <UniversityIcon />,
  "Visa Success Rate": <VisaIcon />,
};

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#fdf6f3",
        backgroundImage: `linear-gradient(rgba(253,246,243,0.88), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: "repeat",
        backgroundSize: "700px auto",
      }}
    >
      {/* MAIN HERO ROW */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
          {/* LEFT */}
          <div className="flex-1 text-center lg:text-left max-w-[560px] lg:max-w-[520px] mx-auto lg:mx-0">
            <h1 className="font-heading font-bold leading-[1.05] tracking-[0.02em]">
              <span className="block text-[#1a2e5a] text-[30px] sm:text-[42px] lg:text-[44px]">Study in Europe</span>
              <span className="block text-[#1a2e5a] text-[26px] sm:text-[38px] lg:text-[40px] mt-1 tracking-[0.12em]">With Confidence</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-6 sm:mt-7">
              <a
                href="#contact"
                className="w-[210px] sm:w-auto inline-flex items-center justify-center px-[22px] py-[9px] bg-[#0b1140] text-white rounded-full text-[13px] font-accent font-medium tracking-wide hover:bg-[#162060] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                Book Free Consultation
              </a>
              <a
                href="#services"
                className="w-[210px] sm:w-auto inline-flex items-center justify-center px-[22px] py-[9px] bg-[#0b1140] text-white rounded-full text-[13px] font-accent font-medium tracking-wide hover:bg-[#162060] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                Our Services
              </a>
            </div>

            {/* SOCIAL */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-5">
              <a href="#linkedin" aria-label="LinkedIn" className="w-7 h-7 rounded-md border border-[#1a2e5a]/20 flex items-center justify-center text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" /></svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-7 h-7 rounded-md border border-[#1a2e5a]/20 flex items-center justify-center text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-7 h-7 rounded-md border border-[#1a2e5a]/20 flex items-center justify-center text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.9V8.1l6.5 3.9-6.5 3.9z" /></svg>
              </a>
              <a href="#instagram2" aria-label="Instagram" className="w-7 h-7 rounded-md border border-[#1a2e5a]/20 flex items-center justify-center text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>

          {/* RIGHT - BLOB IMAGE */}
          <div className="flex-1 flex items-center justify-center lg:justify-end w-full max-w-[520px] mx-auto lg:mx-0">
            <div
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[380px] overflow-hidden shrink-0"
              style={{
                borderRadius: "42% 58% 45% 55% / 38% 42% 58% 62%",
                boxShadow: "0 12px 40px rgba(10,17,64,0.12)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80&auto=format&fit=crop&crop=faces"
                alt="Student with acceptance letter in Europe"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80&auto=format&fit=crop&crop=faces";
                }}
              />
              {/* overlay to simulate acceptance letter */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              {/* Acceptance Letter card like in screenshot */}
              <div className="absolute bottom-[18%] right-[14%] sm:bottom-[14%] sm:right-[10%] bg-[#0b1140] text-[#e8c97a] px-3 sm:px-4 py-4 sm:py-5 rounded-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex flex-col items-center gap-1.5 rotate-[-2deg] border border-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="1.4"><path d="M12 3L4 7v10l8 4 8-4V7z" /><path d="M12 11a3 3 0 100-6 3 3 0 000 6z" /><path d="M8 14c1.5 1 2.8 1.5 4 1.5s2.5-.5 4-1.5" /></svg>
                <span className="text-[8px] sm:text-[9px] font-heading font-semibold tracking-wide leading-tight text-center">Acceptance<br />Letter</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS PILL - exactly like screenshot */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 pb-8 sm:pb-10">
        <div className="bg-[#d6e8ec] rounded-[32px] sm:rounded-full px-4 sm:px-8 py-5 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 sm:gap-0 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          {heroStats.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1 justify-start sm:justify-center gap-3 sm:gap-3.5">
              <div className="shrink-0 w-11 h-11 flex items-center justify-center">{ICONS[s.label] ?? <StudentsIcon />}</div>
              <div className="text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#1a2e5a] font-heading font-bold text-[18px] leading-none">{s.value}</span>
                  <span className="text-[#1a2e5a] font-accent text-[12px] font-semibold leading-none whitespace-nowrap">{s.label}</span>
                </div>
                <p className="text-[#1a2e5a]/60 italic text-[10px] leading-[1.35] mt-1 max-w-[190px] hidden sm:block">{s.sub}</p>
                <p className="text-[#1a2e5a]/60 italic text-[10px] leading-[1.35] mt-1 sm:hidden">{s.sub}</p>
              </div>
              {i < heroStats.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-[#1a2e5a]/20 ml-6 sm:ml-8 shrink-0" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
