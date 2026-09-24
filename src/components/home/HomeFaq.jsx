import { useState } from 'react';
import FaqAccordion from '../FaqAccordion';
import { faqs } from '../../data/faqs';

export default function HomeFaq() {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-8 px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[860px] mx-auto">
        <h2 className="text-center text-[#1a2e5a] font-heading font-bold text-[20px] sm:text-[26px] tracking-wide mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-2.5 sm:gap-3" role="list">
          {faqs.map((faq) => (
            <div key={faq.id} role="listitem">
              <FaqAccordion faq={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
