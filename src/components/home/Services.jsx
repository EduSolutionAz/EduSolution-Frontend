import { services } from '../../data/home';

const ICONS = {
  legal: (
    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 6 L27 15 H21 Z" />
      <path d="M24 6 V3" />
      <circle cx="24" cy="27" r="9" />
      <path d="M24 21 L24 33 M18 27 H30" />
    </svg>
  ),
  admission: (
    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="22" cy="16" r="8" />
      <path d="M22 11 L22 16 L26 18.5" />
      <path d="M8 42 C8 31 36 31 36 42 Z" />
      <path d="M40 8 L42 14 L48 15 L44 20 L45 27 L40 24 L35 27 L36 20 L32 15 L38 14 Z" />
    </svg>
  ),
  visa: (
    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="12" width="30" height="24" rx="2" />
      <path d="M34 18 H44 V30 H34" strokeLinecap="round" />
      <circle cx="13" cy="24" r="4" />
      <path d="M10 24 H30 M10 24 L7 20 M10 24 L7 28" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Services() {
  return (
    <section
      id="services"
      className="py-10 sm:py-14"
      style={{
        backgroundImage: `linear-gradient(rgba(246,238,238,0.95), rgba(246,238,238,0.95)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[1050px] mx-auto px-4">
        <h2 className="text-center text-[#30427d] font-heading font-bold text-[24px] sm:text-[30px] tracking-wide mb-8 sm:mb-10">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" role="list">
          {services.map((s) => (
            <div
              key={s.title}
              role="listitem"
              className="bg-white rounded-md shadow-[0_4px_14px_rgba(8,13,74,0.08)] px-6 py-7 text-center flex flex-col items-center hover:shadow-[0_10px_24px_rgba(8,13,74,0.16)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-[#30427d] mb-4">{ICONS[s.icon]}</div>
              <h3 className="text-[#30427d] font-heading font-bold text-[17px] leading-snug mb-2.5">
                {s.title}
              </h3>
              <p className="text-[#30427d]/80 text-[13px] leading-5">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}