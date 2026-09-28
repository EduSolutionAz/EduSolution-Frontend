import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversitiesList from '../components/UniversitiesList';
import AverageCosts from '../components/AverageCosts';
import { useCountry, useCountryLogos, useTopCountries } from '../services/contentHooks';
import { isUserAuthenticated } from '../services/session';
import { USER_TOKEN_KEY } from '../config/api';
import {
  mapCountry,
  mapCountryFromSummary,
  mapCountryLogos,
  mapTopCountry,
} from '../services/mappers';

function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 text-[#2f3f80]/60 text-[13px]">
      Yüxlənir...
    </div>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default function CountryPage() {
  const { slug } = useParams();
  const [brokenSrc, setBrokenSrc] = useState(null);

  const { data: logoItems } = useCountryLogos();
  const flagMap = mapCountryLogos(logoItems);

  const { data: countries, loading: loadingList } = useTopCountries();
  const countryList = (countries || []).map(mapTopCountry).filter(Boolean);
  const summary = countryList.find((c) => c.slug === slug) || null;
  const countryName = summary?.name || '';

  // GET /country/{name} answers 401 without a token, which pops the browser's
  // native auth dialog. Only request it when a token actually exists.
  const signedIn = isUserAuthenticated();
  const { data, loading } = useCountry(countryName, {
    tokenKey: USER_TOKEN_KEY,
    enabled: signedIn,
  });
  const detail = data ? mapCountry(data) : null;

  // Fall back to the summary entry so a country that exists in
  // /country/top_countries is never shown as "not found".
  const country = detail
    ? { ...summary, ...detail }
    : summary
      ? mapCountryFromSummary(summary)
      : null;

  const flag = country ? flagMap[country.slug] || country.flag : '';

  if (loadingList || (loading && countryName)) {
    return (
      <PageShell>
        <Loading />
      </PageShell>
    );
  }

  if (!country) {
    return (
      <PageShell>
        <main className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#080d4a]">Ölkə tapılmadı</h1>
          <p className="text-sm text-[#080d4a]/70">"{slug}" adlı ölkə mövcud deyil.</p>

          {countryList.length > 0 ? (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {countryList.map((c) => (
                <Link
                  key={c.slug}
                  to={`/country/${c.slug}`}
                  className="px-4 py-1.5 rounded-full bg-[#080d4a] text-white text-[12px] hover:bg-[#141c63] transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              to="/"
              className="mt-2 inline-flex px-5 py-2 rounded-full bg-[#080d4a] text-white text-sm"
            >
              Ana səhifə
            </Link>
          )}
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
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
          <div className="flex items-center justify-center gap-2.5 mb-4 sm:mb-5">
            {flag && (
              <img
                src={flag}
                alt={country.name}
                className="w-7 h-5 object-contain"
                loading="lazy"
              />
            )}
            <h1 className="text-center text-[#2f3f80] font-bold text-[22px] sm:text-[28px] tracking-wide">
              {country.name}
            </h1>
          </div>

          {/* Hero image */}
          <div className="w-full overflow-hidden rounded-[2px] shadow-sm mb-5 sm:mb-6 bg-[#e6dada]">
            {country.heroImage && brokenSrc !== country.heroImage ? (
              <img
                src={country.heroImage}
                alt={country.heroAlt}
                className="w-full h-[190px] sm:h-[360px] object-cover"
                loading="eager"
                onError={() => setBrokenSrc(country.heroImage)}
              />
            ) : (
              <div className="w-full h-[190px] sm:h-[360px] flex items-center justify-center text-[#2f3f80]/40 text-[13px]">
                Şəkil yoxdur
              </div>
            )}
          </div>

          {/* Description */}
          {country.description ? (
            <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6 mb-8 sm:mb-10">
              {country.description}
            </p>
          ) : (
            <p className="text-center text-[#2f3f80]/50 text-[11px] mb-8 sm:mb-10">
              Bu ölkə üçün hələ təfsilat yüklənməyib.
            </p>
          )}

          {/* Universities */}
          <div className="mb-8 sm:mb-10">
            <UniversitiesList
              universities={country.universities}
              countryName={country.name}
              countrySlug={country.slug}
            />
          </div>

          {/* Costs */}
          <div className="mb-8 sm:mb-10">
            <AverageCosts
              tuitionFee={country.card.tuitionFee}
              costs={country.costs}
              countryName={country.name}
            />
          </div>

          {/* Areas */}
          {country.areasText && (
            <section>
              <h2 className="text-center text-[#2f3f80] font-normal text-[18px] sm:text-[22px] tracking-wide mb-3">
                Areas in {country.name}
              </h2>
              <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6">
                {country.areasText}
              </p>
            </section>
          )}
        </div>
      </main>
    </PageShell>
  );
}
