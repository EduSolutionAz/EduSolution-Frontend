import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUniversityName } from '../utils/format';

const PAGE_SIZE = 20;

function UniversityRow({ university, countrySlug }) {
  return (
    <li className="flex items-center gap-2">
      <Link
        to={`/country/${countrySlug}/university/${encodeURIComponent(university.id)}`}
        className="hover:text-[#2f3f80] hover:underline underline-offset-2 transition"
      >
        {getUniversityName(university)}
      </Link>
      {university.isPartner && (
        <span className="shrink-0 rounded-full bg-[#26aec4] px-1.5 py-[1px] text-[8px] sm:text-[9px] font-accent font-semibold text-[#080d4a]">
          Partner
        </span>
      )}
    </li>
  );
}

export default function UniversitiesList({
  universities,
  countryName = 'Germany',
  countrySlug = '',
}) {
  const [page, setPage] = useState({ slug: countrySlug, count: PAGE_SIZE });
  const visibleCount = page.slug === countrySlug ? page.count : PAGE_SIZE;

  const list = universities.filter((u) => getUniversityName(u));
  const visible = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;
  const mid = Math.ceil(visible.length / 2);
  const left = visible.slice(0, mid);
  const right = visible.slice(mid);

  const showMore = () =>
    setPage({ slug: countrySlug, count: Math.min(visibleCount + PAGE_SIZE, list.length) });

  return (
    <section className="w-full">
      <h2 className="text-center text-[#2f3f80] font-normal text-[20px] sm:text-[26px] tracking-wide mb-5 sm:mb-6">
        Universities in {countryName}
      </h2>

      {list.length === 0 ? (
        <p className="text-center italic text-[#2f3f80]/60 text-[11px] sm:text-[12px]">
          *bu ölkədə universitet hələ əlavə edilməyib
        </p>
      ) : (
        <>
          <div className="flex justify-center gap-10 sm:gap-20 text-[12px] sm:text-[13px] text-black/90 leading-6">
            <ul className="list-disc list-inside space-y-0.5">
              {left.map((u) => (
                <UniversityRow key={u.id} university={u} countrySlug={countrySlug} />
              ))}
            </ul>
            <ul className="list-disc list-inside space-y-0.5">
              {right.map((u) => (
                <UniversityRow key={u.id} university={u} countrySlug={countrySlug} />
              ))}
            </ul>
          </div>

          {hasMore && (
            <div className="flex flex-col items-center gap-2 mt-6 sm:mt-8">
              <button
                type="button"
                onClick={showMore}
                className="px-6 py-2 rounded-full border border-[#2f3f80]/40 text-[#2f3f80] text-[12px] font-accent font-medium hover:bg-[#080d4a] hover:text-white hover:border-[#080d4a] transition"
              >
                Daha çox göstər
              </button>
              <span className="text-[11px] text-[#2f3f80]/60">
                {visible.length} / {list.length}
              </span>
            </div>
          )}

          <p className="text-center italic text-[#2f3f80] text-[11px] sm:text-[12px] mt-6 sm:mt-8">
            *click on university name to get detailed information
          </p>
        </>
      )}
    </section>
  );
}
