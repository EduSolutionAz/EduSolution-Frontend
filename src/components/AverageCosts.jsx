export default function AverageCosts({ costs }) {
  return (
    <section className="w-full">
      <h2 className="text-center text-[#2f3f80] text-[18px] sm:text-[22px] font-normal tracking-wide mb-4 sm:mb-5">
        Average Costs for Germany
      </h2>

      {/* Pill bar — dizayndakı açıq mavi kapsul */}
      <div className="bg-[#d6eef2] rounded-full px-4 sm:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 shadow-sm">
        {/* 1 — University Cost */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center sm:justify-start">
          <span className="shrink-0 text-[#1f2a5a]">
            {/* person + book icon */}
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="17" cy="9" r="6" />
              <path d="M7 27 C7 18 27 18 27 27" />
              <path d="M7 22 L17 26 L27 22" />
              <path d="M17 18 L17 26" />
            </svg>
          </span>
          <div className="text-left">
            <div className="text-[#1f2a5a] font-bold text-[16px] leading-none">{costs.university.value}</div>
            <div className="text-[#1f2a5a]/80 text-[10px] leading-tight">{costs.university.label}</div>
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-[#1f2a5a]/30 mx-4" />

        {/* 2 — Rental Fee */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center">
          <span className="shrink-0 text-[#1f2a5a]">
            <svg width="36" height="30" viewBox="0 0 36 30" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 14 L18 2 L34 14" />
              <path d="M6 14 V28 H30 V14" />
              <rect x="14" y="18" width="8" height="10" />
            </svg>
          </span>
          <div className="text-left max-w-[170px]">
            <div className="text-[#1f2a5a] font-bold text-[16px] leading-none">{costs.rental.value}</div>
            <div className="text-[#1f2a5a]/80 text-[10px] leading-tight">{costs.rental.label}</div>
            <div className="text-[#1f2a5a]/60 text-[8px] leading-[1.1] italic">{costs.rental.note}</div>
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-[#1f2a5a]/30 mx-4" />

        {/* 3 — Monthly Spending */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center sm:justify-end">
          <span className="shrink-0 text-[#1f2a5a]">
            <svg width="34" height="30" viewBox="0 0 34 30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8 L8 4 H26 L30 12 L14 14" />
              <path d="M7 8 H27" />
              <circle cx="12" cy="26" r="2.5" />
              <circle cx="22" cy="26" r="2.5" />
              <path d="M10 14 L10 22 H24 L27 12" />
              <path d="M10 11 L10 8 M14 12 L14 8 M18 13 L18 8" />
            </svg>
          </span>
          <div className="text-left max-w-[180px]">
            <div className="text-[#1f2a5a] font-bold text-[16px] leading-none">{costs.monthly.value}</div>
            <div className="text-[#1f2a5a]/80 text-[10px] leading-tight">{costs.monthly.label}</div>
            <div className="text-[#1f2a5a]/60 text-[8px] leading-[1.1] italic">{costs.monthly.note}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
