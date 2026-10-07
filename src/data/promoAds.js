// Ana səhifədəki promo banner və /reklam/:id səhifəsi eyni siyahını
// istifadə edir. Ayrı faylda saxlanılır ki, komponent faylı yalnız
// komponent ixrac etsin (fast refresh).
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
      '14 gün ərzində yaşayış icazəsinin (İQ) rəsmiləşdirilməsi. Sənədlərin hazırlanmasından təhvil verilənə qədər bütün prosesi biz aparıriq.',
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
