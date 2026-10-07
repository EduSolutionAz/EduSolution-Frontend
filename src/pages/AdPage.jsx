import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PROMO_ADS } from '../data/promoAds';
import { getAdInfo } from '../services/adApi';

export default function AdPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  // The static promo list stays as a fallback so an ad that only exists
  // locally (added from the admin panel) still renders.
  const fallback = PROMO_ADS.find((item) => item.id === id);

  useEffect(() => {
    let active = true;

    if (!id) {
      setAd(fallback || null);
      setLoading(false);
      return undefined;
    }

    getAdInfo(id, { auth: false }).then((remote) => {
      if (!active) return;

      if (remote) {
        setAd({
          id: remote.id,
          src: remote.photoUrl || fallback?.src || '',
          alt: remote.title || 'reklam',
          title: remote.title || fallback?.title || '',
          description: remote.content || fallback?.description || '',
        });
      } else {
        setAd(fallback || null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#1a2e5a]/50 text-[13px]">Yüklənir...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ad) {

    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-[#1a2e5a] font-heading font-bold text-[22px] mb-2">Reklam tapılmadı</h1>
            <Link to="/" className="inline-block mt-3 text-[#1a8a99] underline">
              Ana səhifəyə qayıt
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-14">
        {ad.src && (
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl shadow-[0_6px_22px_rgba(0,0,0,0.2)] border border-[#1a2e5a]/10">
            <img
              src={ad.src}
              alt={ad.alt}
              className="w-full h-auto object-cover aspect-square"
              draggable="false"
            />
            <div className="absolute top-3 right-3 rounded-full bg-black/55 text-white text-[12px] font-heading px-4 py-1.5 tracking-wide">
              REKLAM
            </div>
          </div>
        )}

        <div className="max-w-lg w-full mt-6">
          <h1 className="text-[#1a2e5a] font-heading font-bold text-[22px] sm:text-[26px] tracking-wide">
            {ad.title}
          </h1>
          <p className="text-[#1a2e5a]/70 text-[14px] sm:text-[15px] leading-[1.7] mt-3">
            {ad.description}
          </p>

          <div className="mt-7">
            <Link
              to="/"
              className="inline-flex h-[48px] px-8 rounded-full bg-[#080d4a] text-white font-heading font-bold text-[15px] tracking-wide hover:bg-[#1a2e5a] transition-all items-center justify-center"
            >
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}