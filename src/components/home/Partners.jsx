import { partners } from '../../data/home';

export default function Partners() {
  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-[900px] mx-auto px-4">
        <h2 className="text-center text-[#30427d] font-heading font-bold text-[22px] sm:text-[26px] tracking-wide mb-6">
          Our Partners
        </h2>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4" role="list">
          {partners.map((p) => (
            <span
              key={p}
              role="listitem"
              className="px-5 py-2.5 rounded-full border border-[#30427d]/25 bg-white text-[#30427d] text-[12px] sm:text-[13px] font-accent font-medium hover:border-[#30427d] hover:bg-[#080d4a] hover:text-white transition-colors duration-300"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}