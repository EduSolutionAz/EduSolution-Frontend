import { heroStats } from '../../data/home';

export default function Hero() {
  return (
    <section
      className="relative text-center px-4 pt-12 sm:pt-16 pb-8 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(246,238,238,0.92), rgba(246,238,238,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <h1 className="text-[#30427d] font-heading font-bold text-[30px] sm:text-[46px] leading-tight tracking-wide">
        Study in Europe
      </h1>
      <h2 className="text-[#30427d] font-heading font-bold text-[28px] sm:text-[42px] mt-1 tracking-wide">
        With Confidence
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
        <a
          href="#contact"
          className="w-[210px] sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-[#080d4a] text-[#e2eeff] rounded-full text-[13px] sm:text-[14px] font-accent font-medium hover:bg-[#141c63] hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95"
        >
          Book Free Consultation
        </a>
        <a
          href="#services"
          className="w-[210px] sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-[#080d4a] text-[#e2eeff] rounded-full text-[13px] sm:text-[14px] font-accent font-medium hover:bg-[#141c63] hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95"
        >
          Our Services
        </a>
      </div>

      <div className="max-w-[760px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12" role="list">
        {heroStats.map((s) => (
          <div key={s.label} role="listitem" className="flex flex-col items-center">
            <span className="text-[#30427d] font-heading font-bold text-[34px] sm:text-[40px] leading-none">
              {s.value}
            </span>
            <span className="text-[#30427d] font-accent text-[13px] sm:text-[14px] font-semibold mt-1.5">
              {s.label}
            </span>
            <span className="text-[#30427d]/75 italic text-[10px] sm:text-[11px] mt-1 leading-4 max-w-[220px]">
              {s.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}