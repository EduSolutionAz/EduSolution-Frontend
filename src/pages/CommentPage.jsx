import { useParams, Link } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getComments, getCountryBySlug, subscribe } from '../store/adminStore';

export default function CommentPage() {
  const { id } = useParams();
  const comment = useSyncExternalStore(
    subscribe,
    () => getComments().find((c) => c.id === id) ?? null,
    () => getComments().find((c) => c.id === id) ?? null,
  );

  if (!comment) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#080d4a]">Şərh tapılmadı</h1>
          <p className="text-sm text-[#080d4a]/70">Bu link aktiv deyil.</p>
          <Link to="/" className="mt-2 inline-flex px-5 py-2 rounded-full bg-[#080d4a] text-white text-sm">
            Ana səhifəyə qayıt
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />
      <main
        className="flex-1"
        style={{
          backgroundImage: `linear-gradient(rgba(246,238,238,0.94), rgba(246,238,238,0.94)), url('/assets/topographic.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div className="max-w-[600px] mx-auto px-4 py-12 sm:py-16">
          <h1 className="text-center text-[#2f3f80] font-bold text-[22px] sm:text-[28px] tracking-wide mb-6">
            Şərh burada
          </h1>
          {comment.countrySlug && (() => {
            const country = getCountryBySlug(comment.countrySlug);
            return country ? (
              <p className="text-center text-[#323643]/70 text-[13px] mb-4">
                Ölkə: <strong>{country.name}</strong>
              </p>
            ) : null;
          })()}
          <blockquote className="bg-white rounded-lg shadow px-6 py-5 text-center mb-6">
            <p className="text-[#323643] text-[14px] leading-6 italic">
              "{comment.text || 'Heç bir şərh yoxdur.'}"
            </p>
          </blockquote>
          <p className="text-center text-[#323643]/50 text-[11px]">
            Link yaradıldı: {new Date(comment.createdAt).toLocaleString('az-AZ')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
