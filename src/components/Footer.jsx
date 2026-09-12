export default function Footer() {
  return (
    <footer className="bg-[#080d4a] text-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-7 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start sm:col-start-1 sm:row-start-1">
          <h3 className="text-[14px] italic mb-2">Site Map</h3>
          <div className="flex flex-row sm:flex-col flex-wrap justify-center gap-x-5 gap-y-1.5 sm:gap-1 text-[13px] sm:text-[12px]">
            <a href="#about" className="hover:text-cyan-300 transition">
              About Us
            </a>
            <a href="#study" className="hover:text-cyan-300 transition">
              Study Abroad
            </a>
            <a href="#visa" className="hover:text-cyan-300 transition">
              Visa Help
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center text-center order-[-1] sm:order-none sm:col-start-2">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="ES" className="w-[25px] h-[25px] object-contain" />
            <span className="text-[14px] italic font-medium whitespace-nowrap">EduSolution Academy</span>
          </div>
          <p className="text-[11px] sm:text-[10px] leading-5 sm:leading-4 max-w-[280px] sm:max-w-[230px] mt-2 text-white/90">
            Find universities, visa information, tuition fees and admission requirements for your dream country.
          </p>
          <p className="text-[12px] sm:text-[11px] italic mt-4 text-white/80">©EduSolution Academy 2026</p>
        </div>

        <div className="flex flex-col items-center sm:items-end sm:text-right">
          <h3 className="text-[14px] italic mb-3 sm:mb-4">Our Social Media Accounts</h3>
          <div className="flex gap-3 justify-center sm:justify-end">
            <a href="#linkedin" aria-label="LinkedIn" className="hover:text-cyan-300 transition p-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
              </svg>
            </a>
            <a href="#instagram" aria-label="Instagram" className="hover:text-cyan-300 transition p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#youtube" aria-label="YouTube" className="hover:text-cyan-300 transition p-1">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.9V8.1l6.5 3.9-6.5 3.9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
