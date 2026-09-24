import { services } from '../../data/home';

const ICONS = {
  legal: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1a2e5a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3 L15.5 10 H12.5 Z" />
      <circle cx="14" cy="17.5" r="5.5" />
      <path d="M14 14.5 V20.5 M11 17.5 H17" />
    </svg>
  ),
  admission: (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" stroke="#1a2e5a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="5.5" />
      <path d="M10 7.5 V10 L12.2 11.8" />
      <path d="M2 24.5 C2 19.5 18 19.5 18 24.5" />
      <path d="M24 6.5 L25.2 9.2 L28 9.6 L26 11.8 L26.5 14.6 L24 13.2 L21.5 14.6 L22 11.8 L20 9.6 L22.8 9.2 Z" />
    </svg>
  ),
  visa: (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="#1a2e5a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="12" rx="1.2" />
      <path d="M20 10 H28 V16 H20" />
      <rect x="6" y="10.5" width="8" height="5" rx="0.8" fill="#1a2e5a" opacity="0.12" stroke="none" />
      <path d="M8.5 13 H13.5 M10 13 L8 11.5 M10 13 L8 14.5" strokeWidth="1.1" />
      <circle cx="14.5" cy="13" r="1" fill="#1a2e5a" stroke="none" />
    </svg>
  ),
};

export default function Services() {
  return (
    <section
      id="services"
      className="py-10 sm:py-12 bg-[#080d4a]"
      style={{
        backgroundImage: `linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">
        <h2 className="text-center text-white font-heading font-bold text-[20px] sm:text-[22px] tracking-wide mb-7 sm:mb-8">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5" role="list">
          {services.map((s) => (
            <div
              key={s.title}
              role="listitem"
              className="bg-[#fdf6f3] rounded-[6px] shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-[#1a2e5a]/5 px-5 sm:px-6 py-6 sm:py-7 text-center flex flex-col items-center"
            >
              <div className="mb-3.5 text-[#1a2e5a]">{ICONS[s.icon]}</div>
              <h3 className="text-[#1a2e5a] font-heading font-bold text-[12px] sm:text-[13px] leading-tight">{s.title}</h3>
              <p className="text-[#1a2e5a]/60 text-[10px] sm:text-[11px] leading-[1.6] mt-2 max-w-[210px]">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
