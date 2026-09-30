import {
  formatSemesterCount,
  formatUsd,
  getUniversityTypeLabel,
} from '../utils/format';

function FeeIcon() {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="7" width="30" height="16" rx="2" />
      <circle cx="17" cy="15" r="4" />
      <path d="M6 15h2.5M25.5 15H28" strokeLinecap="round" />
    </svg>
  );
}

function SemesterIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="6" width="24" height="22" rx="2" />
      <path d="M4 13h24M11 3v6M21 3v6" strokeLinecap="round" />
      <path d="M10 19h4M18 19h4M10 24h4" strokeLinecap="round" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg width="30" height="32" viewBox="0 0 30 32" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12h24L15 3 3 12Z" strokeLinejoin="round" />
      <path d="M6 14v13M12 14v13M18 14v13M24 14v13" />
      <path d="M3 29h24" strokeLinecap="round" />
    </svg>
  );
}

function Cell({ icon, value, label, note, align = 'center' }) {
  const justify =
    align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center';

  return (
    <div className={`flex items-center gap-3 sm:gap-4 flex-1 ${justify}`}>
      <span className="shrink-0 text-[#1f2a5a]">{icon}</span>
      <div className="text-left">
        <div className="text-[#1f2a5a] font-bold text-[16px] leading-none">{value}</div>
        <div className="text-[#1f2a5a]/80 text-[10px] leading-tight mt-0.5">{label}</div>
        {note && (
          <div className="text-[#1f2a5a]/60 text-[8px] leading-[1.2] mt-0.5 italic">{note}</div>
        )}
      </div>
    </div>
  );
}

export default function UniversityInfo({ university }) {
  const semesters = formatSemesterCount(university.semesterCount);

  return (
    <section className="w-full">
      <h2 className="text-center text-[#2f3f80] font-heading font-bold text-[19px] sm:text-[24px] tracking-wide mb-4 sm:mb-5">
        University Info
      </h2>

      <div className="bg-[#d6eef2] rounded-full px-4 sm:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 shadow-sm">
        <Cell
          align="start"
          icon={<FeeIcon />}
          value={formatUsd(university.universityFee)}
          label="University Fee"
          note="Per semester"
        />

        <div className="hidden sm:block w-px self-stretch bg-[#1f2a5a]/30 mx-4" />

        <Cell
          icon={<SemesterIcon />}
          value={semesters || '—'}
          label="Semester Count"
          note="Per academic year"
        />

        <div className="hidden sm:block w-px self-stretch bg-[#1f2a5a]/30 mx-4" />

        <Cell
          align="end"
          icon={<TypeIcon />}
          value={getUniversityTypeLabel(university.universityType)}
          label="University Type"
        />
      </div>
    </section>
  );
}
