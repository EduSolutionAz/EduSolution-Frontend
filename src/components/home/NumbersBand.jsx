import { funNumbers } from '../../data/home';

export default function NumbersBand() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="max-w-[900px] mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center" role="list">
        {funNumbers.map((n) => (
          <div key={n.label} role="listitem">
            <div className="text-[#080d4a] font-heading font-bold text-[26px] sm:text-[32px] leading-none">
              {n.value}
            </div>
            <div className="text-[#323643] text-[11px] sm:text-[12px] mt-1.5 font-accent">{n.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}