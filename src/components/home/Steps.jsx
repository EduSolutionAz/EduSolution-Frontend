import { steps } from '../../data/home';

export default function Steps() {
  return (
    <section
      className="py-10 sm:py-14"
      style={{
        backgroundImage: `linear-gradient(rgba(246,238,238,0.95), rgba(246,238,238,0.95)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-center text-[#30427d] font-heading font-bold text-[22px] sm:text-[28px] tracking-wide mb-8">
          Step By Step to your Academic Dream
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3" role="list">
          {steps.map((step, i) => (
            <div
              key={step.title}
              role="listitem"
              className="bg-[#080d4a] rounded-md px-3 py-4 text-center flex flex-col items-center justify-center hover:bg-[#141c63] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="text-[24px] leading-none mb-2">{step.emoji}</span>
              <span className="text-[#e2eeff] font-accent text-[11px] font-semibold mb-0.5">
                Step {i + 1}
              </span>
              <span className="text-[#f7f7f7] text-[11.5px] leading-4">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}