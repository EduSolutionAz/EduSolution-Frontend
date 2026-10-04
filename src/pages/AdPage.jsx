import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const PROMO_ADS = [
  {
    id: 'admission',
    src: '/assets/promo_ad_1.png',
    alt: 'Universitetə qəbul',
    title: 'Universitetə qəbul',
    description:
      'Avropanın nüfuzlu universitetlərində bakalavr və magistr proqramlarına qəbulda sənə tam dəstək veririk: sənəd toplusu, qəbul şansı analizi və proqram seçimi.',
  },
  {
    id: 'visa',
    src: '/assets/promo_ad_2.png',
    alt: 'Viza dəstəyi',
    title: 'Viza dəstəyi',
    description:
      'Tələbə, iş və turistik vizalar üçün sürətli və etibarlı müraciət. Sənədlərinizin düzgünlüyünü yoxlayır, hər addımı izləyirik.',
  },
  {
    id: 'residence',
    src: '/assets/promo_ad_3.png',
    alt: 'Yaşayış icazəsi',
    title: 'Yaşayış icazəsi',
    description:
      '14 gün ərzində yaşayış icazəsinin (İQ) rəsmiləşdirilməsi. Sənədlərin hazırlanmasından təhvil verilənə qədər bütün prosesi biz aparırıq.',
  },
  {
    id: 'consultation',
    src: '/assets/promo_ad_4.png',
    alt: 'Pulsuz konsultasiya',
    title: 'Pulsuz konsultasiya',
    description:
      'Peşəkar məsləhətçimizlə ilk görüş tamamən pulsuzdur. Təhsil məqsədlərin üçün ən uyğun ölkə və universiteti birlikdə müəyyən edirik.',
  },
  {
    id: 'language',
    src: '/assets/promo_ad_5.png',
    alt: 'Dil hazırlığı',
    title: 'Dil hazırlığı',
    description:
      'Xaricə gedən tələbələr üçün İngilis dili proqramları: IELTS hazırlığı, akademik dil və tələbə vizası üçün tələb olunan səviyyəyə qədər dəstək.',
  },
];

export default function AdPage() {
  const { id } = useParams();
  const ad = PROMO_ADS.find((a) => a.id === id);

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-[#1a2e5a] font-heading font-bold text-[22px] mb-2">Reklam tapılmadı</h1>
            <Link to="/" className="inline-block mt-3 text-[#1a8a99] underline">
              Ana səhifəyə qayıt
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-14">
        <div className="relative w-full max-w-lg overflow-hidden rounded-xl shadow-[0_6px_22px_rgba(0,0,0,0.2)] border border-[#1a2e5a]/10">
          <img
            src={ad.src}
            alt={ad.alt}
            className="w-full h-auto object-cover aspect-square"
            draggable="false"
          />
          <div className="absolute top-3 right-3 rounded-full bg-black/55 text-white text-[12px] font-heading px-4 py-1.5 tracking-wide">
            REKLAM
          </div>
        </div>

        <div className="max-w-lg w-full mt-6">
          <h1 className="text-[#1a2e5a] font-heading font-bold text-[22px] sm:text-[26px] tracking-wide">
            {ad.title}
          </h1>
          <p className="text-[#1a2e5a]/70 text-[14px] sm:text-[15px] leading-[1.7] mt-3">
            {ad.description}
          </p>

          <div className="mt-7">
            <Link
              to="/"
              className="inline-flex h-[48px] px-8 rounded-full bg-[#080d4a] text-white font-heading font-bold text-[15px] tracking-wide hover:bg-[#1a2e5a] transition-all items-center justify-center"
            >
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}