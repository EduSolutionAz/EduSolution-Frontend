// Backend-ə qoşulmağa hazır ölkə məlumat mənbəyi.
// Həm Working With kartları, həm CountryPage buradan oxuyur (tək mənbə prinsipi).
export const countries = [
  {
    slug: 'germany',
    name: 'Almaniya',
    flag: '🇩🇪',
    card: {
      universityCount: 400,
      tuitionFee: 0,
      features: ['Viza dəstəyi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Almaniya',
    description: `Almaniya dövlət universitetlərində təhsil haqqı olmadan dünya səviyyəsində təhsil təklif edir. Güclü iqtisadiyyatı, zəngin mədəniyyəti və təhsildən sonra iş imkanları ilə beynəlxalq tələbələr üçün ən populyar istiqamətlərdən biridir. Almaniyadakı universitetlər hər sahədə tədqiqat, innovasiya və yüksək akademik standartları ilə tanınır. Mühəndislikdən sosial elmlərə qədər tələbələr həm böyük texniki universitetlərdə, həm də kiçik ixtisaslaşmış müəssisələrdə əla imkanlar tapırlar.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
      'E Universiteti',
      'F Universiteti',
    ],
    costs: {
      rental: { value: '1200$', label: 'Kirayə haqqı', note: '1200$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '500$', label: 'Aylıq xərc', note: 'Market və gündəlik yaşayış üçün minimum 500$ tələb olunur' },
    },
    areasText: `Almaniya hər birinin öz universitetləri və yaşayış xərcləri olan 16 federal əyalətdən ibarətdir. Populyar tələbə bölgələrinə Berlin, Münhen, Frankfurt və Drezden daxildir. Yaşayış xərci şəhərlər arasında əhəmiyyətli dərəcədə dəyişə bilər, buna görə büdcənizə və akademik hədəflərinizə ən uyğun, eyni zamanda rahat tələbə həyatı təklif edən bölgəni seçməyə kömək edirik.`,
  },
  {
    slug: 'turkiye',
    name: 'Türkiyə',
    flag: '🇹🇷',
    card: {
      universityCount: 100,
      tuitionFee: 300,
      features: ['İş icazəsi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Türkiyə',
    description: `Türkiyə çox əlverişli qiymətlərlə yüksək keyfiyyətli təhsil təklif edir və bu, onu beynəlxalq tələbələr üçün sevimli edir. Ölkə regional təhsil mərkəzinə çevrilir və hər il minlərlə tələbə həm təhsil, həm də iş imkanları üçün Türkiyə universitetlərini seçir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '300$', label: 'Kirayə haqqı', note: '300$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '200$', label: 'Aylıq xərc', note: 'Gündəlik yaşayış büdcəyə çox uyğundur' },
    },
    areasText: `İstanbul, Ankara və İzmir Türkiyədə ən populyar tələbə şəhərləridir. Hər şəhərin özünəməxsus ab-havası və yaşayış xərcləri var. Universitetinizə və büdcənizə uyğun düzgün bölgəni tapmağa kömək edirik.`,
  },
  {
    slug: 'poland',
    name: 'Polşa',
    flag: '🇵🇱',
    card: {
      universityCount: 400,
      tuitionFee: 800,
      features: ['Viza dəstəyi', 'Yaşayış icazəsi'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1567879406871-76370466114a?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Polşa',
    description: `Polşa əlverişli qiymətə keyfiyyətli Avropa təhsili istəyən tələbələr üçün əla seçimdir. Aşağı yaşayış xərci və böyüyən iş bazarı sayəsində bir çox məzun təhsildən sonra qalıb işləməyi seçir. Komandamız Polşada TRC leqallaşdırma proseslərində də kömək edir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '600$', label: 'Kirayə haqqı', note: '600$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '400$', label: 'Aylıq xərc', note: 'Rahat gündəlik yaşayış büdcəsi' },
    },
    areasText: `Varşava, Krakov, Vrotslav və Qdansk Polşanın əsas tələbə mərkəzləridir. Onlar tarixi cazibəni müasir kampuslar və canlı tələbə ab-havası ilə birləşdirir.`,
  },
  {
    slug: 'latvia',
    name: 'Latviya',
    flag: '🇱🇻',
    card: {
      universityCount: 60,
      tuitionFee: 0,
      features: ['Viza dəstəyi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1541397160136-5029b6e07300?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Latviya',
    description: `Latviya Avropa İttifaqının üzvüdür və şərtləri ödəyən tələbələr üçün bir çox dövlət universitetində ödənişsiz təhsil təklif edir. Paytaxt Riqa böyüyən beynəlxalq icması və tələbələr üçün yüksək viza uğur nisbəti ilə canlı bir şəhərdir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '400$', label: 'Kirayə haqqı', note: '400$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '300$', label: 'Aylıq xərc', note: 'Büdcəyə uyğun gündəlik yaşayış' },
    },
    areasText: `Riqa müasir yataqxanalar və təhlükəsiz, mehriban mühitlə Latviyada tələbə həyatının qəlbindədir. Ölkənin qalan hissəsi sakit və yaşıl həyat tərzi təklif edir.`,
  },
  {
    slug: 'italy',
    name: 'İtaliya',
    flag: '🇮🇹',
    card: {
      universityCount: 400,
      tuitionFee: 0,
      features: ['Viza dəstəyi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'İtaliya',
    description: `İtaliya zəngin akademik ənənəni dünya şöhrətli incəsənət, memarlıq və mətbəxlə birləşdirir. Bir çox dövlət universiteti beynəlxalq tələbələrə ödənişsiz təhsil təklif edir və ölkə dizayn, moda, mühəndislik və tibb üçün ən yaxşı seçimlərdən biridir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '800$', label: 'Kirayə haqqı', note: '800$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '500$', label: 'Aylıq xərc', note: 'Standart gündəlik yaşayış büdcəsi' },
    },
    areasText: `Milan, Roma, Bolonya və Florensiya İtaliyanın ən populyar tələbə şəhərləridir. Hər biri tarix, mədəniyyət və müasir universitet həyatının unikal qarışığını təklif edir.`,
  },
  {
    slug: 'spain',
    name: 'İspaniya',
    flag: '🇪🇸',
    card: {
      universityCount: 400,
      tuitionFee: 0,
      features: ['Viza dəstəyi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'İspaniya',
    description: `İspaniya beynəlxalq tələbələri açıq qolla qarşılayır. Bir neçə dövlət universitetində ödənişsiz təhsil, isti iqlim və zəngin mədəniyyətlə Avropada təhsil və yaşayış üçün əla seçimdir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '700$', label: 'Kirayə haqqı', note: '700$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '450$', label: 'Aylıq xərc', note: 'Balanslı gündəlik yaşayış xərci' },
    },
    areasText: `Madrid, Barselona, Valensiya və Sevilya İspaniyanın ən yaxşı tələbə şəhərləridir. Onlar canlı kampuslar, günəşli hava və əlverişli yaşayışla tanınır.`,
  },
  {
    slug: 'united-kingdom',
    name: 'Birləşmiş Krallıq',
    flag: '🇬🇧',
    card: {
      universityCount: 400,
      tuitionFee: 800,
      features: ['Viza dəstəyi', 'Yaşayış icazəsi'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Birləşmiş Krallıq',
    description: `Birləşmiş Krallıq dünyanın ən nüfuzlu universitetlərindən bəzilərinə ev sahibliyi edir. Tədqiqat sahəsində güclü nüfuza malik olan ölkə beynəlxalq tələbələrə əla akademik dəstək və məzuniyyətdən sonra karyera imkanları təklif edir.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '1200$', label: 'Kirayə haqqı', note: '1200$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '700$', label: 'Aylıq xərc', note: 'Böyük şəhərlərdə daha yüksək yaşayış xərci' },
    },
    areasText: `London, Mançester, Birminqem və Qlazqo ən populyar istiqamətlərdir. Hər şəhər dünya səviyyəsində universitetlər və canlı multikultural tələbə həyatı təklif edir.`,
  },
  {
    slug: 'america',
    name: 'Amerika',
    flag: '🇺🇸',
    card: {
      universityCount: 400,
      tuitionFee: 0,
      features: ['Viza dəstəyi', 'Yataqxanalar'],
    },
    heroImage:
      'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1400&q=80',
    heroAlt: 'Amerika',
    description: `Amerika müxtəlif universitetlər və proqramlar təklif edir. İctimai kolleclərdən ən yüksək reytinqli tədqiqat universitetlərinə qədər tələbələr güclü kampus həyatı və şəbəkələşmə imkanları ilə hədəflərinə uyğun seçim tapa bilərlər.`,
    universities: [
      'X Universiteti',
      'Y Universiteti',
      'A Universiteti',
      'B Universiteti',
      'C Universiteti',
      'D Universiteti',
    ],
    costs: {
      rental: { value: '1000$', label: 'Kirayə haqqı', note: '1000$-dan başlayaraq yaşayış yeri tapa bilərsiniz' },
      monthly: { value: '600$', label: 'Aylıq xərc', note: 'Standart gündəlik yaşayış büdcəsi' },
    },
    areasText: `Tələbələr Şərqi Sahil, Qərbi Sahil və mərkəzi ştatlar arasında seçim edir. Hər bölgə fərqli universitetlər, iqlim və yaşayış xərcləri təklif edir və müqayisə etməyinizə kömək edirik.`,
  },
];
