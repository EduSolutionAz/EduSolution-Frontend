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
      className="bg-[#080d4a] py-10 sm:py-14"
      style={{
        backgroundImage: `linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[1050px] mx-auto px-4">
        <h2 className="text-center text-[#e2eeff] font-heading font-bold text-[24px] sm:text-[30px] tracking-wide mb-4">
          Why EduSolution Academy
        </h2>
        <p className="text-center text-[#f7f7f7]/85 text-[13px] sm:text-[14px] leading-6 max-w-[820px] mx-auto mb-9">
          {whyUs.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5" role="list">
          {whyUs.items.map((item) => (
            <div key={item.title} role="listitem" className="flex items-start gap-3">
              <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-[16px]">
                {ICONS[item.title] ?? '✓'}
              </span>
              <div>
                <h3 className="text-[#e2eeff] font-accent font-semibold text-[15px]">{item.title}</h3>
                <p className="text-[#f7f7f7]/80 text-[12.5px] leading-5 mt-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}