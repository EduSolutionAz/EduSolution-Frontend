export default function FaqAccordion({ faq, isOpen, onToggle, index }) {
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-button-${faq.id}`;

  return (
    <div className="w-full">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 text-left px-4 sm:px-5 min-h-[44px] py-3 text-white text-[13px] sm:text-[15px] font-light tracking-wide transition-colors cursor-pointer ${
          isOpen ? 'bg-[#0a1145]' : 'bg-[#0a1145] hover:bg-[#141c63]'
        }`}
      >
        <span className="flex-1 font-heading font-semibold">{faq.question}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 inline-flex items-center justify-center text-[18px] sm:text-[22px] font-bold leading-none transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`}
        >
          &gt;
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#2c3a79] px-4 sm:px-5 py-4 text-white/95 text-[12px] sm:text-[13px] font-light leading-5 sm:leading-6">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}
