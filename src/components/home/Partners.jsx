const PARTNER_LOGOS = [
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/budapest_metropolitan_university_logo.png', alt: 'Budapest Metropolitan University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/cyprus-science-university-logo.png', alt: 'Cyprus Science University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/medipol_university_logo.png', alt: 'Medipol University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/vistula_university_logo.png', alt: 'Vistula University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/vizja_logo.png', alt: 'VIZJA University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/ted.png', alt: 'TED University' },
  { src: '/assets/wsb_logo_transparent.png', alt: 'WSB University' },
  { src: 'https://pub-61dff26e8b8b473ab8b89d3b5b489917.r2.dev/university-bucket/world_peace_university_logo.png', alt: 'World Peace University' },
];

export default function Partners() {
  return (
    <section
      className="py-7 sm:py-9 overflow-hidden"
      style={{
        backgroundColor: '#fdf6f3',
        backgroundImage: `linear-gradient(rgba(253,246,243,0.92), rgba(253,246,243,0.92)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h2 className="text-center text-[#1a2e5a] font-heading font-bold text-[20px] sm:text-[22px] tracking-wide mb-7 sm:mb-8">
          Our Partners
        </h2>
      </div>

      {/* marquee wrapper - hover pauses animation - seamless loop */}
      <div className="marquee-group relative overflow-x-hidden py-3" style={{ overflowY: 'visible' }}>
        <div className="marquee-track flex items-center gap-8 sm:gap-10 w-max py-2">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
            <img
              key={`${p.src}-${i}`}
              src={p.src}
              alt={p.alt}
              className="h-11 sm:h-13 lg:h-16 w-auto max-w-[150px] sm:max-w-[170px] object-contain shrink-0 transition-transform duration-300 ease-out hover:scale-[1.18] cursor-pointer will-change-transform"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
