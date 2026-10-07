import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversitiesList from '../components/UniversitiesList';
import AverageCosts from '../components/AverageCosts';
import {
  useAllCountries,
  useCountry,
  useCountryEntity,
  useCountryLogos,
  useTopCountries,
  useUniversitiesByCountry,
} from '../services/contentHooks';
import {
  mapCountry,
  mapCountryEntity,
  mapCountryFromSummary,
  mapCountryLogos,
} from '../services/mappers';

import { gradientFor, universityInitials } from '../utils/format';

function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 text-[#2f3f80]/60 text-[13px]">
      Yüxlənir...
    </div>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function slugToGuess(slug) {
  try {
    const decoded = decodeURIComponent(slug || '');
    return decoded.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  } catch {
    return String(slug || '').replace(/[-_]+/g, ' ').trim();
  }
}

export default function CountryPage() {
  const { slug } = useParams();
  const [brokenSrc, setBrokenSrc] = useState(null);

  const { data: logoItems } = useCountryLogos();
  const flagMap = mapCountryLogos(logoItems);

  // useAllCountries və useTopCountries artıq map edilmiş ölkə obyektləri
  // qaytarır (country_name yoxdur). Onları təkrar map etmək siyahını boş
  // edirdi, ona görə olduğu kimi birləşdirilir.
  const { data: allCountries, loading: loadingList } = useAllCountries();
  const { data: topCountries, loading: loadingTop } = useTopCountries();
  const mergedBySlug = new Map();
  [...(allCountries || []), ...(topCountries || [])].forEach((c) => {
    if (!mergedBySlug.has(c.slug)) mergedBySlug.set(c.slug, c);
  });
  const countryList = [...mergedBySlug.values()];
  const normalizedSlug = String(slug || '').toLowerCase();
  const guess = slugToGuess(slug);
  const summary =
    countryList.find(
      (c) =>
        c.slug === normalizedSlug ||
        c.name.toLowerCase() === normalizedSlug ||
        c.name.toLowerCase() === guess.toLowerCase(),
    ) || null;
  // Əgər summary tapılmasa, slug-ı birbaşa backend-ə göndərmək işləməz,
  // çünki backend real ad gözləyir ("yeni-olke" yox, "Yeni Olke").
  // Ona görə slug-ı boşluqlu tahminə çevirib onu sorğulayırıq.
  const countryName = summary?.name || guess || slug || '';

  const { data, loading } = useCountry(countryName);
  const detail = data ? mapCountry(data) : null;

  // /country/country_detail omits the fees, the flag and the background image,
  // so those come from /country/country_entity.
  const { data: entityData } = useCountryEntity(countryName);
  const entity = mapCountryEntity(entityData);

  // Universitetlər ayrı endpoint-dən gəlir; country_detail çox vaxt boş
  // siyahı qaytarır, ona görə bu siyahı həlledicidir.
  const { data: rawUniversities } = useUniversitiesByCountry(countryName);
  const universities = (rawUniversities || [])
    .map((entry) => (typeof entry === 'string' ? entry : entry?.university_name))
    .filter(Boolean)
    .map((universityName) => ({ id: universityName, universityName }));

  // Fall back to the summary entry so a country that exists is never shown as
  // "not found".
  const base = detail || (summary ? mapCountryFromSummary(summary) : null);
  const country = base
    ? {
        ...base,
        heroImage: (base.heroImage || (entity && entity.heroImage)) || '',
        card: { ...base.card, ...(entity && entity.card) },
        costs: entity ? entity.costs : base.costs,
        universities: universities.length > 0 ? universities : base.universities || [],
      }
    : null;

  const flag = (country && flagMap[country.slug]) || (entity && entity.flag) || '';

  if (loadingList || loadingTop || (loading && countryName)) {
    return (
      <PageShell>
        <Loading />
      </PageShell>
    );
  }

  if (!country) {
    return (
      <PageShell>
<main className="flex-1 w-full min-w-0 overflow-hidden flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <h1 className="text-2xl font-bold text-[#080d4a]">Ölkə tapılmadı</h1>
            <p className="text-sm text-[#080d4a]/70 break-words [overflow-wrap:anywhere]">"{slug}" adlı ölkə mövcud deyil.</p>
          <p className="text-[11px] text-[#080d4a]/50 max-w-[520px]">
            Axtarılan: slug="{slug}", tahmin="{countryName}". Siyahıda {countryList.length} ölkə var.
            Əgər yeni yaratmısansa: 1) /admin-də siyahıda görünür? 2) Adı olduğu kimi yaz
            (məs: "Cənubi Koreya" üçün /country/cenubi-koreya). 3) Brauzerdə Network-də
            GET /country/all cavabında country_name varmı yoxla.
          </p>

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
        className="flex-1 w-full min-w-0 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(246,238,238,0.94), rgba(246,238,238,0.94)), url('/assets/topographic.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div className="max-w-[900px] mx-auto w-full min-w-0 px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 overflow-hidden">
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
            <h1 className="text-center text-[#2f3f80] font-heading font-bold text-[24px] sm:text-[32px] tracking-wide">
              {country.name}
            </h1>
            {country.icon && <span className="text-[20px] leading-none">{country.icon}</span>}
          </div>

          {/* Hero image */}
          <div
            className="w-full overflow-hidden rounded-[2px] shadow-sm mb-5 sm:mb-6"
            style={country.heroImage && brokenSrc !== country.heroImage
              ? { backgroundColor: '#d8cccc' }
              : { background: gradientFor(country.name) }}
          >
            {country.heroImage && brokenSrc !== country.heroImage ? (
              <img
                src={country.heroImage}
                alt={country.heroAlt}
                className="w-full h-[190px] sm:h-[360px] object-cover"
                loading="eager"
                onError={() => setBrokenSrc(country.heroImage)}
              />
            ) : (
              <div className="w-full h-[190px] sm:h-[360px] flex flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="text-white/85 font-heading font-bold text-[40px] sm:text-[56px] leading-none">
                  {universityInitials(country.name) || country.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-white/70 text-[12px] sm:text-[14px] tracking-wide">
                  {country.name}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {country.description ? (
            <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6 mb-8 sm:mb-10 break-words [overflow-wrap:anywhere] whitespace-pre-line">
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
              <h2 className="text-center text-[#2f3f80] font-heading font-bold text-[19px] sm:text-[24px] tracking-wide mb-3">
                Regions &amp; Areas
              </h2>
              <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6 break-words [overflow-wrap:anywhere] whitespace-pre-line">
                {country.areasText}
              </p>
            </section>
          )}
        </div>
      </main>
    </PageShell>
  );
}
