import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FaqAccordion from '../components/FaqAccordion';
import { useFaqs } from '../services/contentHooks';
export default function FaqPage() {
  const { data: faqs, loading, error } = useFaqs();
  const [openId, setOpenId] = useState(undefined);

  const activeId = openId === undefined || (openId && !faqs.some((faq) => faq.id === openId))
    ? (faqs[0]?.id ?? null)
    : openId;

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
            {'Tez-tez verilən suallar'}
          </h1>

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
            {loading && faqs.length === 0 && (
              <p className="text-center text-[#2f4486]/60 text-[13px] py-10">
                {'FAQ-lar yüklənir…'}
              </p>
            )}
            {error && faqs.length === 0 && (
              <p role="alert" className="text-center text-[#2f4486]/60 text-[13px] py-10">
                {'FAQ-ları yükləmək mümkün olmadı'}
              </p>
            )}
            {!loading && !error && faqs.length === 0 && (
              <p className="text-center text-[#2f4486]/60 text-[13px] py-10">
                {'Hələ sual əlavə edilməyib'}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
