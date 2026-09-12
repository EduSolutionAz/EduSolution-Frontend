import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FaqAccordion from '../components/FaqAccordion';
import { faqs } from '../data/faqs';

export default function FaqPage() {
  // Dizaynda birinci sual açıqdır, yalnız bir panel açıq qalır
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />

      <main
        className="flex-1 px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24"
        style={{
          backgroundImage: `
            linear-gradient(rgba(246,238,238,0.92), rgba(246,238,238,0.92)),
            url('/assets/topographic.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div className="max-w-[1050px] mx-auto">
          <h1 className="text-center text-[#2f4486] font-bold text-[22px] sm:text-[30px] tracking-wide mb-6 sm:mb-8">
            Frequently Asked Questions
          </h1>

          <div className="flex flex-col gap-2.5 sm:gap-3" role="list">
            {faqs.map((faq) => (
              <div key={faq.id} role="listitem">
                <FaqAccordion
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
