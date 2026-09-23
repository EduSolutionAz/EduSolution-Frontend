import { useParams, Link } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversitiesList from '../components/UniversitiesList';
import AverageCosts from '../components/AverageCosts';
import { getCountryBySlug, subscribe } from '../store/adminStore';

export default function CountryPage() {
  const { slug } = useParams();
  const country = useSyncExternalStore(
    subscribe,
    () => getCountryBySlug(slug ?? 'germany'),
    () => getCountryBySlug(slug ?? 'germany'),
  );

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#080d4a]">Ölkə tapılmadı</h1>
          <p className="text-sm text-[#080d4a]/70">"{slug}" adlı ölkə mövcud deyil.</p>
          <Link to="/country/germany" className="mt-2 inline-flex px-5 py-2 rounded-full bg-[#080d4a] text-white text-sm">
            Germany-ə get
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
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Title */}
          <h1 className="text-center text-[#2f3f80] font-bold text-[22px] sm:text-[28px] tracking-wide mb-4 sm:mb-5">
            {country.name}
          </h1>

          {/* Hero image */}
          <div className="w-full overflow-hidden rounded-[2px] shadow-sm mb-5 sm:mb-6">
            <img
              src={country.heroImage}
              alt={country.heroAlt}
              className="w-full h-[190px] sm:h-[360px] object-cover"
              loading="eager"
            />
          </div>

          {/* Description */}
          <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6 mb-8 sm:mb-10">
            {country.description}
          </p>

          {/* Universities */}
          <div className="mb-8 sm:mb-10">
            <UniversitiesList universities={country.universities} countryName={country.name} />
          </div>

          {/* Costs */}
          <div className="mb-8 sm:mb-10">
            <AverageCosts costs={country.costs} countryName={country.name} />
          </div>

          {/* Areas */}
          <section>
            <h2 className="text-center text-[#2f3f80] text-[18px] sm:text-[22px] font-normal tracking-wide mb-3">
              Areas in {country.name}
            </h2>
            <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6">
              {country.areasText}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
