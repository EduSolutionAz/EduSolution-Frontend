import { WHATSAPP_DISPLAY, whatsappLink } from '../config/contact';

/**
 * Sabit (floating) WhatsApp düyməsi. Bütün ictimai səhifələrdə görünür ki,
 * WhatsApp nömrəsi yalnız "Contact us" bölməsində qalmasın.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp: ${WHATSAPP_DISPLAY}`}
      title={WHATSAPP_DISPLAY}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] text-[#080d4a] pl-3 pr-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.32)] hover:bg-[#2ee06f] hover:scale-105 active:scale-95 transition-all"
    >
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.8-1.48-1.78-1.65-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.15 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.8h-.03a9.7 9.7 0 0 1-4.95-1.35l-.35-.21-3.67.96.98-3.58-.23-.37a9.72 9.72 0 0 1-1.49-5.2c0-5.38 4.38-9.76 9.77-9.76 2.6 0 5.05 1.02 6.9 2.86a9.7 9.7 0 0 1 2.85 6.91c0 5.38-4.38 9.76-9.78 9.76zm8.55-18.33A11.74 11.74 0 0 0 12.05 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.16 1.6 5.97L.07 24l6.23-1.63a11.9 11.9 0 0 0 5.75 1.46h.01c6.58 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.49-8.44z" />
      </svg>

      {/* Nömrə geniş ekranlarda görünür, kiçik ekranlarda gizlədir. */}
      <span className="hidden sm:inline font-accent font-semibold text-[13px] whitespace-nowrap">
        {WHATSAPP_DISPLAY}
      </span>
    </a>
  );
}
