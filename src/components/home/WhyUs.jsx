import { whyUs } from '../../data/home';

const ICONS = {
  'Personalized Consultation': '🎯',
  'University Admissions': '📚',
  'Visa Assistance': '🛂',
  'Accommodation Support': '🏠',
  'Legalization & Residence Support': '📋',
  'Continuous Support': '🤝',
};

export default function WhyUs() {
  return (
    <section
      className="relative py-10 sm:py-12 lg:py-14 overflow-hidden bg-[#080d4a]"
      style={{
        backgroundImage: `linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="relative max-w-[980px] mx-auto px-4 sm:px-6">
        <h2 className="text-center text-white font-heading font-bold text-[20px] sm:text-[22px] tracking-wide">
          Why EduSolution Academy
        </h2>

        <p className="text-center text-white/70 text-[10px] sm:text-[11px] leading-[1.7] mt-3 max-w-[620px] mx-auto">
          {whyUs.intro}
        </p>

        <div className="mt-8 sm:mt-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 sm:gap-x-12 gap-y-6 sm:gap-y-7 max-w-[860px] mx-auto" role="list">
          {whyUs.items.map((item) => (
            <div key={item.title} role="listitem" className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-[13px] sm:text-[14px] leading-none">
                {ICONS[item.title] ?? '•'}
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-white font-accent font-semibold text-[11px] sm:text-[12px] leading-tight">{item.title}</h3>
                <p className="text-white/60 text-[10px] sm:text-[11px] leading-[1.6] mt-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
