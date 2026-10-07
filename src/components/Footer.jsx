import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { WHATSAPP_DISPLAY, whatsappLink } from '../config/contact';

// Boş "url" dəyərləri süzülür, ona görə sosial blok yalnız real
// linklər yazıldıqda görünür. Linkləri buradan əlavə etmək olar.
const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', url: '', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  ) },
  { key: 'instagram', label: 'Instagram', url: '', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ) },
  { key: 'youtube', label: 'YouTube', url: '', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.9V8.1l6.5 3.9-6.5 3.9z" />
    </svg>
  ) },
];

const socials = SOCIAL_LINKS.filter((item) => item.url);

/** Ana səhifədəki bölməyə keçid: SPA routing qorunur, tam yeniləmə olmur. */
function SectionLink({ to, children }) {
  return (
    <Link
      to={{ pathname: '/', hash: to.slice(1) }}
      className="hover:text-cyan-300 transition"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#080d4a] text-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-7 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start sm:col-start-1 sm:row-start-1">
          <h3 className="text-[14px] italic mb-2">Site Map</h3>
          <div className="flex flex-row sm:flex-col flex-wrap justify-center gap-x-5 gap-y-1.5 sm:gap-1 text-[13px] sm:text-[12px]">
            <SectionLink to="/#about">About Us</SectionLink>
            <SectionLink to="/#study">Study Abroad</SectionLink>
            <SectionLink to="/#services">Visa Help</SectionLink>
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
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp: ${WHATSAPP_DISPLAY}`}
            className="mt-3 inline-flex items-center gap-2 text-[12px] text-white/80 hover:text-[#25D366] transition"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.8-1.48-1.78-1.65-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.15 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.8h-.03a9.7 9.7 0 0 1-4.95-1.35l-.35-.21-3.67.96.98-3.58-.23-.37a9.72 9.72 0 0 1-1.49-5.2c0-5.38 4.38-9.76 9.77-9.76 2.6 0 5.05 1.02 6.9 2.86a9.7 9.7 0 0 1 2.85 6.91c0 5.38-4.38 9.76-9.78 9.76zm8.55-18.33A11.74 11.74 0 0 0 12.05 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.16 1.6 5.97L.07 24l6.23-1.63a11.9 11.9 0 0 0 5.75 1.46h.01c6.58 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.49-8.44z" />
            </svg>
            {WHATSAPP_DISPLAY}
          </a>
          <p className="text-[12px] sm:text-[11px] italic mt-4 text-white/80">©EduSolution Academy 2026</p>
        </div>

        {socials.length > 0 && (
          <div className="flex flex-col items-center sm:items-end sm:text-right">
            <h3 className="text-[14px] italic mb-3 sm:mb-4">Our Social Media Accounts</h3>
            <div className="flex gap-3 justify-center sm:justify-end">
              {socials.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="hover:text-cyan-300 transition p-1"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bütün ictimai səhifələrdə görünən sabit WhatsApp düyməsi. */}
      <WhatsAppButton />
    </footer>
  );
}
