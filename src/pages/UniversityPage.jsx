import { useParams, Link } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountryFlag from '../components/CountryFlag';
import UniversityInfo from '../components/UniversityInfo';
import {
  getCountryBySlug,
  getUniversityById,
  subscribe,
} from '../store/adminStore';
import {
  getUniversityName,
  getUniversityTypeLabel,
  universityInitials,
} from '../utils/format';

const PAGE_BACKGROUND = {
  backgroundImage: `linear-gradient(rgba(246,238,238,0.94), rgba(246,238,238,0.94)), url('/assets/topographic.png')`,
  backgroundRepeat: 'repeat',
  backgroundSize: '650px auto',
};

function UniversityLogo({ university, name }) {
  if (university.universityLogo) {
    return (
      <img
        src={university.universityLogo}
        alt={name}
        className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] object-contain rounded-md bg-white shadow-sm shrink-0"
      />
    );
  }

  return (
    <div
      className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-md bg-[#080d4a] text-white flex items-center justify-center font-heading font-bold text-[22px] sm:text-[26px] shrink-0"
      aria-hidden="true"
    >
      {universityInitials(name) || 'U'}
    </div>
  );
}

export default function UniversityPage() {
  const { slug, id } = useParams();

  const getUniversity = () => getUniversityById(slug, id) ?? null;
  const university = useSyncExternalStore(subscribe, getUniversity, getUniversity);

  const getCountry = () => getCountryBySlug(slug) ?? null;
  const country = useSyncExternalStore(subscribe, getCountry, getCountry);

  if (!university) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#080d4a]">Universitet tapılmadı</h1>
          <p className="text-sm text-[#080d4a]/70">Bu universitet artıq mövcud deyil.</p>
          <Link
            to={`/country/${slug}`}
            className="mt-2 inline-flex px-5 py-2 rounded-full bg-[#080d4a] text-white text-sm"
          >
            Ölkə səhifəsinə qayıt
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const name = getUniversityName(university);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />

      <main className="flex-1" style={PAGE_BACKGROUND}>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <nav className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#2f3f80]/70 mb-4 sm:mb-5">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link to={`/country/${slug}`} className="hover:underline">
              {country ? country.name : slug}
            </Link>
            <span>/</span>
            <span className="text-[#2f3f80]">{name}</span>
          </nav>

          <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
            <UniversityLogo university={university} name={name} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-[#2f3f80] font-bold text-[20px] sm:text-[26px] leading-tight">
                  {name}
                </h1>
                {university.isPartner && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#26aec4] px-2.5 py-[3px] text-[10px] font-accent font-semibold text-[#080d4a]">
                    Partner
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-[12px] text-[#2f3f80]/80">
                {country && (
                  <span className="inline-flex items-center gap-1.5">
                    <CountryFlag country={country} className="w-[18px] h-[13px]" emojiClass="text-[14px]" />
                    {country.name}
                  </span>
                )}
                {university.city && <span>{university.city}</span>}
                <span>{getUniversityTypeLabel(university.universityType)}</span>
              </div>

              {university.shortDescription && (
                <p className="text-[#2f3f80] text-[11px] sm:text-[13px] leading-[1.7] mt-3">
                  {university.shortDescription}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8 sm:mb-10">
            <UniversityInfo university={university} />
          </div>

          {university.content && (
            <section className="mb-8 sm:mb-10">
              <h2 className="text-center text-[#2f3f80] text-[18px] sm:text-[22px] font-normal tracking-wide mb-3">
                About {name}
              </h2>
              <p className="text-center text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.8] sm:leading-7 whitespace-pre-line">
                {university.content}
              </p>
            </section>
          )}

          {university.area && (
            <section className="mb-8 sm:mb-10 text-center">
              <h2 className="text-[#2f3f80] text-[18px] sm:text-[22px] font-normal tracking-wide mb-3">
                Area
              </h2>
              <p className="text-[#2f3f80] text-[10px] sm:text-[12px] leading-[1.7] sm:leading-6">
                {university.area}
              </p>
            </section>
          )}

          {university.faculties.length > 0 && (
            <section>
              <h2 className="text-center text-[#2f3f80] text-[18px] sm:text-[22px] font-normal tracking-wide mb-4">
                Faculties
              </h2>
              <ul className="flex flex-wrap justify-center gap-2" role="list">
                {university.faculties.map((faculty) => (
                  <li
                    key={faculty.id}
                    className="bg-white rounded-full shadow-sm px-4 py-1.5 text-[11px] sm:text-[12px] text-[#2f3f80]"
                  >
                    {faculty.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
