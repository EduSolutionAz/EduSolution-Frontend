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
    <section className="bg-[#080d4a] py-10 sm:py-14">
      <div className="max-w-[780px] mx-auto px-4">
        <h2 className="text-center text-[#e2eeff] font-heading font-bold text-[22px] sm:text-[28px] tracking-wide mb-9">
          What are people saying about us
        </h2>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous comment"
            className="shrink-0 text-[#f7f7f7] text-[34px] font-bold leading-none hover:text-[#26aec4] transition-colors cursor-pointer px-1"
          >
            &lt;
          </button>

          <figure
            key={active}
            className="flex-1 bg-[#0a1145] rounded-md px-6 sm:px-10 py-7 text-center"
            style={{ animation: 'fadeSlide 500ms ease both' }}
          >
            <svg className="w-8 h-8 mx-auto mb-3 text-[#26aec4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4v8c0 4 2.5 7.5 6 8v-3c-2-.8-3-2.4-3-4h4V4H4zm11 0v8c0 4 2.5 7.5 6 8v-3c-2-.8-3-2.4-3-4h4V4h-7z" />
            </svg>
            <blockquote className="text-[#f7f7f7] text-[14px] sm:text-[15px] leading-6">
              “{item.text}”
            </blockquote>
            <figcaption className="text-[#e2eeff] text-[12.5px] font-accent font-medium mt-4">
              — {item.author}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next comment"
            className="shrink-0 text-[#f7f7f7] text-[34px] font-bold leading-none hover:text-[#26aec4] transition-colors cursor-pointer px-1"
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
                i === active ? 'bg-[#26aec4] w-5' : 'bg-[#f7f7f7]/30 hover:bg-[#f7f7f7]/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}