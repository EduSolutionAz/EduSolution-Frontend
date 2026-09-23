// Backend-ə qoşulmağa hazır ölkə məlumat mənbəyi.
// Həm Working With kartları, həm CountryPage buradan oxuyur (tək mənbə prinsipi).
export const countries = [
  {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Free Tuition Fee',
      features: ['Visa Help', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Germany',
    description: `Germany offers world-class education at public universities with no tuition fees. With a strong economy, rich culture and generous post-study work options, it is one of the most popular destinations for international students. Universities in Germany are known for research, innovation and high academic standards across every field. From engineering to social sciences, students find excellent opportunities in both large technical universities and smaller specialised institutions.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
      'University of E',
      'University of F',
    ],
    costs: {
      university: { value: 'Free', label: 'University Cost', note: '' },
      rental: { value: '1200$', label: 'Rental Fee', note: 'Starting from 1200$, you can find a place to live' },
      monthly: { value: '500$', label: 'Monthly Spending', note: 'Minimum of 500$ is required for market spendings and daily living' },
    },
    areasText: `Germany is a country of 16 federal states, each with its own universities and living costs. Popular student areas include Berlin, Munich, Frankfurt and Dresden. The cost of living can vary significantly between cities, so we help you choose the area that best matches your budget and academic goals while still offering a comfortable student life.`,
  },
  {
    slug: 'turkiye',
    name: 'Turkiye',
    flag: '🇹🇷',
    card: {
      universityCount: '100+ universities',
      tuitionTag: 'Low Tuition Fee',
      features: ['Work Permit', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Turkiye',
    description: `Turkiye offers high-quality education at very affordable prices, making it a favourite for international students. The country is becoming a regional education hub, and thousands of students choose Turkish universities every year for both study and work opportunities.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Low', label: 'University Cost', note: 'Affordable tuition for all programs' },
      rental: { value: '300$', label: 'Rental Fee', note: 'Starting from 300$, you can find a place to live' },
      monthly: { value: '200$', label: 'Monthly Spending', note: 'Daily living is very budget friendly' },
    },
    areasText: `Istanbul, Ankara and Izmir are the most popular student cities in Turkiye. Each city has a distinct vibe and living costs. We help you find the right area based on your university and budget.`,
  },
  {
    slug: 'poland',
    name: 'Poland',
    flag: '🇵🇱',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Affordable',
      features: ['Visa Help', 'Residence Permit'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1567879406871-76370466114a?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Poland',
    description: `Poland is a great option for students who want quality European education at an affordable price. Thanks to the low cost of living and growing job market, many graduates choose to stay and work after their studies. Our team also helps with TRC legalization processes in Poland.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Affordable', label: 'University Cost', note: 'Low tuition across most programs' },
      rental: { value: '600$', label: 'Rental Fee', note: 'Starting from 600$, you can find a place to live' },
      monthly: { value: '400$', label: 'Monthly Spending', note: 'Comfortable daily living budget' },
    },
    areasText: `Warsaw, Krakow, Wrocław and Gdansk are the main student hubs in Poland. They combine historic charm with modern campuses and a lively student atmosphere.`,
  },
  {
    slug: 'latvia',
    name: 'Latvia',
    flag: '🇱🇻',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Free Tuition Fee',
      features: ['Visa Help', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1541397160136-5029b6e07300?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Latvia',
    description: `Latvia is a member of the European Union and offers free tuition at many state universities for qualifying students. Riga, the capital, is a vibrant city with a growing international community and a high visa success rate for students.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Free', label: 'University Cost', note: '' },
      rental: { value: '400$', label: 'Rental Fee', note: 'Starting from 400$, you can find a place to live' },
      monthly: { value: '300$', label: 'Monthly Spending', note: 'Budget friendly daily living' },
    },
    areasText: `Riga is the heart of student life in Latvia, with modern dormitories and a safe, friendly environment. The rest of the country offers a calm and green lifestyle.`,
  },
  {
    slug: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Free Tuition Fee',
      features: ['Visa Help', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Italy',
    description: `Italy combines a rich academic tradition with world-famous art, architecture and cuisine. Many public universities offer free tuition to international students, and the country is a top choice for design, fashion, engineering and medicine.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Free', label: 'University Cost', note: '' },
      rental: { value: '800$', label: 'Rental Fee', note: 'Starting from 800$, you can find a place to live' },
      monthly: { value: '500$', label: 'Monthly Spending', note: 'Standard daily living budget' },
    },
    areasText: `Milan, Rome, Bologna and Florence are the most popular student cities in Italy. Each offers a unique blend of history, culture and modern university life.`,
  },
  {
    slug: 'spain',
    name: 'Spain',
    flag: '🇪🇸',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Free Tuition Fee',
      features: ['Visa Help', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Spain',
    description: `Spain welcomes international students with open arms. With free tuition at several public universities, a warm climate and a rich culture, it is an excellent choice for studying and living in Europe.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Free', label: 'University Cost', note: '' },
      rental: { value: '700$', label: 'Rental Fee', note: 'Starting from 700$, you can find a place to live' },
      monthly: { value: '450$', label: 'Monthly Spending', note: 'Balanced daily living cost' },
    },
    areasText: `Madrid, Barcelona, Valencia and Seville are the top student cities in Spain. They are famous for lively campuses, sunny weather and affordable living.`,
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Affordable',
      features: ['Visa Help', 'Residence Permit'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'United Kingdom',
    description: `The United Kingdom is home to some of the most prestigious universities in the world. With a strong reputation for research, international students benefit from excellent academic support and career prospects after graduation.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Affordable', label: 'University Cost', note: 'Varied tuition by program' },
      rental: { value: '1200$', label: 'Rental Fee', note: 'Starting from 1200$, you can find a place to live' },
      monthly: { value: '700$', label: 'Monthly Spending', note: 'Higher living cost in big cities' },
    },
    areasText: `London, Manchester, Birmingham and Glasgow are the most popular destinations. Each city offers world-class universities and a vibrant multicultural student life.`,
  },
  {
    slug: 'america',
    name: 'America',
    flag: '🇺🇸',
    card: {
      universityCount: '400+ universities',
      tuitionTag: 'Free Tuition Fee',
      features: ['Visa Help', 'Dormitories'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'America',
    description: `America offers a diverse range of universities and programs. From community colleges to top ranked research universities, students can find the right fit for their goals, supported by strong campus life and networking opportunities.`,
    universities: [
      'University of X',
      'University of Y',
      'University of A',
      'University of B',
      'University of C',
      'University of D',
    ],
    costs: {
      university: { value: 'Free', label: 'University Cost', note: 'Scholarships are widely available' },
      rental: { value: '1000$', label: 'Rental Fee', note: 'Starting from 1000$, you can find a place to live' },
      monthly: { value: '600$', label: 'Monthly Spending', note: 'Standard daily living budget' },
    },
    areasText: `Students choose between the East Coast, West Coast and central states. Each area offers different universities, climates and living costs that we help you compare.`,
  },
];

export function getCountryBySlug(slug) {
  return countries.find((c) => c.slug === slug);
}