import { useState } from 'react';
import { testimonials } from '../../data/home';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const goTo = (index) => {
    const next = (index + total) % total;
    setActive(next);
  };

  const item = testimonials[active];

  return (
    <section
      className="py-10 sm:py-14"
      style={{
        backgroundImage: `linear-gradient(rgba(246,238,238,0.95), rgba(246,238,238,0.95)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[780px] mx-auto px-4">
        <h2 className="text-center text-[#1a2e5a] font-heading font-bold text-[22px] sm:text-[28px] tracking-wide mb-9">
          What are people saying about us
        </h2>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous comment"
            className="shrink-0 text-[#1a2e5a] text-[34px] font-bold leading-none hover:text-[#1a2e5a]/70 transition-colors cursor-pointer px-1"
          >
            &lt;
          </button>

          <figure
            key={active}
            className="flex-1 bg-white rounded-md shadow-[0_4px_14px_rgba(26,46,90,0.08)] px-6 sm:px-10 py-7 text-center border border-[#1a2e5a]/5"
            style={{ animation: 'fadeSlide 500ms ease both' }}
          >
            <svg className="w-8 h-8 mx-auto mb-3 text-[#1a2e5a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4v8c0 4 2.5 7.5 6 8v-3c-2-.8-3-2.4-3-4h4V4H4zm11 0v8c0 4 2.5 7.5 6 8v-3c-2-.8-3-2.4-3-4h4V4h-7z" />
            </svg>
            <blockquote className="text-[#1a2e5a] text-[14px] sm:text-[15px] leading-6">
              “{item.text}”
            </blockquote>
            <figcaption className="text-[#1a2e5a]/70 text-[12.5px] font-accent font-medium mt-4">
              — {item.author}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next comment"
            className="shrink-0 text-[#1a2e5a] text-[34px] font-bold leading-none hover:text-[#1a2e5a]/70 transition-colors cursor-pointer px-1"
          >
            &gt;
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((t, i) => (
            <button
              key={t.author}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show comment ${i + 1}`}
              aria-current={i === active}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === active ? 'bg-[#1a2e5a] w-5' : 'bg-[#1a2e5a]/20 hover:bg-[#1a2e5a]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}