import { useState, useSyncExternalStore } from 'react';
import FaqAccordion from '../FaqAccordion';
import { getFaqs, subscribe } from '../../store/adminStore';

export default function HomeFaq() {
  const faqs = useSyncExternalStore(subscribe, getFaqs, getFaqs);
  const [openId, setOpenId] = useState(undefined);

  const activeId = openId === undefined ? (faqs[0]?.id ?? null) : openId;

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
              <FaqAccordion
                faq={faq}
                isOpen={activeId === faq.id}
                onToggle={() => setOpenId((prev) => (prev === faq.id ? null : faq.id))}
              />
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-center text-[#1a2e5a]/60 text-[13px] py-8">Hələ sual əlavə edilməyib</p>
          )}
        </div>
      </div>
    </section>
  );
}
