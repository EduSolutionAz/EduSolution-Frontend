import { formatUsd, formatUsdAmount, normalizeUniversityType, slugify } from '../utils/format';

export const SERVICE_OPTIONS = [
  { value: 'UNIVERSITY', label: 'Admission to Universities' },
  { value: 'RESIDENCE_PERMIT', label: 'Residence Permit' },
  { value: 'VISA', label: 'Student / Work / Touristic Visa' },
];

export const SERVICE_VALUES = ['VISA', 'RESIDENCE_PERMIT', 'UNIVERSITY'];

const EMPTY_COST = { value: '—', label: '', note: '' };

const EMPTY_COSTS = {
  rental: { ...EMPTY_COST, label: 'Rental Fee' },
  monthly: { ...EMPTY_COST, label: 'Monthly Spending' },
};

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function firstField(record, fields) {
  for (const field of fields) {
    const value = record?.[field];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function text(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * /country/top_countries -> [{ country_name, university_count, visa_help,
 * dormitory_help, country_bg_url }]
 */
export function mapTopCountry(dto) {
  const canonicalName = text(firstField(dto, ['country_name', 'countryName', 'name']));
  const name = canonicalName;
  if (!name) return null;

  const features = [];
  if (dto.visa_help || dto.isVisaHelp) features.push('Visa Help');
  if (dto.dormitory_help || dto.isDormitoryHelp) features.push('Dormitories');
  return {
    slug: slugify(canonicalName || name),
    apiName: canonicalName || name,
    name,
    flag: '',
    heroImage: text(dto.country_bg_url || dto.countryBgUrl || dto.country_background_url),
    heroAlt: name,
    card: {
      universityCount: Number(dto.university_count ?? dto.universityCount) || 0,
      tuitionFee: 0,
      features,
    },
    countryBgUrl: text(dto.country_bg_url || dto.countryBgUrl || dto.country_background_url),
    visaHelp: Boolean(dto.visa_help || dto.isVisaHelp),
    dormitoryHelp: Boolean(dto.dormitory_help || dto.isDormitoryHelp),
  };
}

/**
 * /country/all -> [{ country_name, university_count, is_visa_help,
 * is_dormitory_help }]. Different field names from /country/top_countries.
 */
export function mapAllCountry(dto) {
  const canonicalName = text(firstField(dto, ['country_name', 'countryName', 'name']));
  const name = canonicalName;
  if (!name) return null;

  const features = [];
  if (dto.is_visa_help) features.push('Visa Help');
  if (dto.is_dormitory_help) features.push('Dormitories');

  return {
    slug: slugify(canonicalName || name),
    apiName: canonicalName || name,
    name,
    flag: '',
    heroImage: '',
    heroAlt: name,
    description: '',
    areasText: '',
    universities: [],
    card: {
      universityCount: Number(dto.university_count) || 0,
      tuitionFee: 0,
      features,
    },
    countryBgUrl: '',
    visaHelp: Boolean(dto.is_visa_help),
    dormitoryHelp: Boolean(dto.is_dormitory_help),
    isTopList: false,
  };
}

/**
 * /country/country_entity/{countryName}
 * { country_name, flag_image, country_image, university_count, tuition_fee,
 *   rental_fee, monthly_spending, is_visa_help, is_dormitory_help, is_top_list,
 *   content, area, icon }
 */
export function mapCountryEntity(dto) {
  if (!dto) return null;

  const canonicalName = text(firstField(dto, ['country_name', 'countryName', 'name']));
  const name = canonicalName;
  const tuitionFee = Number(dto?.tuition_fee ?? dto?.tuitionFee) || 0;
  const rentalFee = Number(dto?.rental_fee ?? dto?.rentalFee) || 0;
  const monthlySpending = Number(
    dto?.monthly_spending ?? dto?.monthlySpending ?? dto?.monthlySpendingAmount ?? dto?.monthly_spending_amount,
  ) || 0;

  return {
    countryName: name,
    apiName: canonicalName || name,
    name,
    heroImage: text(dto?.country_image ?? dto?.countryImage ?? dto?.heroImage ?? dto?.photo_url),
    flag: text(dto?.flag_image ?? dto?.flagImage ?? dto?.flag),
    icon: text(dto?.icon),
    content: text(firstField(dto, ['content', 'description', 'about'])),
    area: text(firstField(dto, ['area', 'areas'])),
    card: {
      universityCount: Number(dto?.university_count ?? dto?.universityCount) || 0,
      tuitionFee,
      features: [
        ...((dto?.is_visa_help ?? dto?.isVisaHelp ?? dto?.visaHelp) ? ['Visa Help'] : []),
        ...((dto?.is_dormitory_help ?? dto?.isDormitoryHelp ?? dto?.dormitoryHelp) ? ['Dormitories'] : []),
      ],
    },
    costs: {
      rental: {
        ...EMPTY_COSTS.rental,
        value: rentalFee > 0 ? formatUsd(rentalFee) : EMPTY_COSTS.rental.value,
      },
      monthly: {
        ...EMPTY_COSTS.monthly,
        value: monthlySpending > 0 ? formatUsdAmount(monthlySpending) : EMPTY_COSTS.monthly.value,
      },
    },
    isTopList: Boolean(dto?.is_top_list ?? dto?.isTopList),
  };
}

/**
 * Attaches flag URLs from /country/country_logos onto already-mapped
 * countries, matching on slug.
 */
export function attachFlags(countries, flagMap) {
  if (!flagMap) return countries;
  return countries.map((country) => {
    const url = flagMap[country.slug];
    return url ? { ...country, flag: url } : country;
  });
}

/**
 * /country/country_logos -> [{ country_flag_url }]
 * Returns { [slugified country name]: flagUrl }.
 * URLs look like ".../country-bucket/spain_flag", so the "_flag" suffix is
 * stripped to match the country slug ("spain").
 */
export function mapCountryLogos(items) {
  const map = {};
  asList(items).forEach((item) => {
    const url = text(item?.country_flag_url);
    if (!url) return;
    const file = url.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
    const key = slugify(file.replace(/_flag$/i, '').replace(/_/g, ' '));
    if (key && !map[key]) map[key] = url;
  });
  return map;
}

/**
 * /university/university_logos -> [{ university_logo_url }]
 */
export function mapUniversity(dto) {
  if (!dto) return null;

  let data = dto;
  if (data && typeof data === 'object') {
    if (data.data && typeof data.data === 'object') data = data.data;
    else if (Array.isArray(data) && data[0] && typeof data[0] === 'object') data = data[0];
  }

  let root = data && typeof data === 'object' ? data : dto;
  // also check nested objects
  if (root && typeof root === 'object') {
    const candidates = [root, root.university, root.result, root.response, root.item];
    for (const c of candidates) {
      if (c && typeof c === 'object') root = c;
    }
  }

  function findDeep(obj, keys) {
    if (!obj || typeof obj !== 'object') return undefined;
    const keySet = new Set(keys.map((k) => k.toLowerCase()));
    for (const [k, v] of Object.entries(obj)) {
      if (keySet.has(String(k).toLowerCase())) return v;
    }
    for (const v of Object.values(obj)) {
      if (v && typeof v === 'object') {
        const res = findDeep(v, keys);
        if (res !== undefined && res !== null && res !== '') return res;
      }
    }
    return undefined;
  }

  const canonicalName =
    firstField(root, ['university_name', 'universityName', 'title', 'name', 'universityTitle']) ??
    findDeep(root, ['university_name', 'universityname', 'title', 'name', 'universitytitle']);
  const name = canonicalName;

  if (typeof name !== 'string' || !name.trim()) return null;
  const displayName = name.trim();
  const apiName = String(canonicalName || displayName).trim();

  const feeRaw =
    root?.fee ??
    root?.university_fee ??
    root?.universityFee ??
    root?.tuition_fee ??
    root?.tuitionFee ??
    root?.price ??
    root?.cost ??
    root?.amount ??
    root?.feeAmount ??
    root?.university_cost ??
    root?.universityCost ??
    root?.education_fee ??
    root?.educationFee ??
    root?.payment ??
    findDeep(root, ['fee', 'university_fee', 'universityfee', 'tuition_fee', 'tuitionfee', 'education_fee', 'educationfee']);

  let universityFee = 0;
  if (feeRaw === 0 || feeRaw === '0') {
    universityFee = 0;
  } else if (feeRaw != null && feeRaw !== '') {
    const cleaned = String(feeRaw).replace(/[^0-9.]/g, '');
    const n = Number(cleaned);
    universityFee = Number.isFinite(n) ? n : 0;
  }

  const uniType =
    root?.university_type ??
    root?.universityType ??
    root?.type ??
    root?.university_type_name ??
    root?.category ??
    root?.university_category ??
    root?.education_type ??
    root?.educationType ??
    (typeof root?.universityType === 'object' ? (root.universityType.name || root.universityType.value || root.universityType.code) : undefined) ??
    (typeof root?.type === 'object' ? (root.type.name || root.type.value || root.type.code) : undefined) ??
    findDeep(root, ['university_type', 'universitytype', 'type', 'category']);

  const semesterCount = Number(findDeep(root, ['semester_count', 'semestercount', 'semesterCount', 'semesters', 'numberofsemesters', 'termcount']) ?? root?.semester_count ?? root?.semesterCount ?? root?.semesters ?? 0) || 0;

  const uni = {
    id: apiName,
    apiName,
    universityName: displayName,
    universityType: normalizeUniversityType(uniType),
    isPartner: Boolean(root?.is_partner ?? root?.isPartner ?? root?.partner ?? root?.isPartnerUniversity ?? root?.is_partner_university),
    shortDescription: text(firstField(root, ['short_description', 'shortDescription', 'shortDesc', 'description_short'])),
    universityLogo: text(root?.university_logo ?? root?.universityLogo ?? root?.photo_url ?? root?.photoUrl ?? root?.logo ?? root?.logoUrl ?? root?.image_url ?? root?.imageUrl ?? root?.university_image),
    city: text(firstField(root, ['city'])),
    area: text(firstField(root, ['area', 'areas'])),
    content: text(firstField(root, ['content', 'description', 'about', 'info', 'long_description', 'body'])),
    viewUrl: text(root?.view_url ?? root?.viewUrl ?? root?.viewUrlLink),
    universityFee: Number.isFinite(universityFee) ? universityFee : 0,
    semesterCount,
    countryName: text(firstField(root, ['country_name', 'countryName', 'country'])),
    faculties: asList(firstField(root, ['faculties', 'facultyList', 'facultiesList']))
      .map((entry) => {
        if (typeof entry === 'string') return text(entry);
        return text(firstField(entry, ['faculty_name', 'facultyName', 'name']));
      })
      .filter(Boolean)
      .map((facultyName) => ({ id: facultyName, name: facultyName })),
  };
  return uni;
}

/**
 * /country/country_detail/{countryName}
 * { title, photo_url, content, universities, university_cost, monthly_spending,
 *   rental_fee, areas }
 */
export function mapCountry(dto) {
  const canonicalName = text(firstField(dto, ['title', 'country_name', 'countryName', 'name']));
  const name = canonicalName;
  if (!name) return null;

  const universityCost = Number(dto?.university_cost ?? dto?.universityCost) || 0;
  const rentalFee = Number(dto?.rental_fee ?? dto?.rentalFee) || 0;
  const monthlySpending = Number(
    dto?.monthly_spending ?? dto?.monthlySpending ?? dto?.monthlySpendingAmount ?? dto?.monthly_spending_amount,
  ) || 0;

  return {
    slug: slugify(canonicalName || name),
    apiName: canonicalName || name,
    name,
    heroImage: text(dto.photo_url ?? dto.photoUrl ?? dto.countryImage),
    heroAlt: name,
    description: text(firstField(dto, ['content', 'description'])),
    areasText: text(firstField(dto, ['areas', 'area'])),
    universities: asList(dto.universities)
      .map((entry) => {
        if (typeof entry === 'string') return text(entry);
        return text(firstField(entry, ['name', 'university_name', 'universityName']));
      })
      .filter(Boolean)
      .map((universityName, index) => {
        const entry = asList(dto.universities)[index];
        const apiName = typeof entry === 'string'
          ? entry
          : text(firstField(entry, ['name', 'university_name', 'universityName'])) || universityName;
        return { id: apiName, apiName, universityName };
      }),
    card: {
      universityCount: asList(dto.universities).length || 0,
      tuitionFee: universityCost,
      features: [],
    },
    costs: {
      rental: {
        ...EMPTY_COSTS.rental,
        value: rentalFee > 0 ? formatUsd(rentalFee) : EMPTY_COSTS.rental.value,
      },
      monthly: {
        ...EMPTY_COSTS.monthly,
        value: monthlySpending > 0 ? formatUsdAmount(monthlySpending) : EMPTY_COSTS.monthly.value,
      },
    },
  };
}

/**
 * Builds a country page from the summary entry in /country/top_countries.
 * Used when GET /country/{name} is unavailable so a country that exists is
 * never rendered as "not found".
 */
export function mapCountryFromSummary(summary) {
  if (!summary) return null;

  return {
    slug: summary.slug,
    apiName: summary.apiName || summary.name,
    name: summary.name,
    flag: summary.flag || '',
    heroImage: summary.heroImage || '',
    heroAlt: summary.heroAlt || summary.name,
    description: '',
    areasText: '',
    universities: [],
    card: summary.card || { universityCount: 0, tuitionFee: 0, features: [] },
    costs: { rental: { ...EMPTY_COSTS.rental }, monthly: { ...EMPTY_COSTS.monthly } },
    detailsUnavailable: true,
  };
}

/**
 * /university/university_details/{name} or /university/university_entity/{name}
 * Supports: { title, content, faculties[], photo_url, view_url } and
 * { university_name, country_name, university_type, short_description, fee,
 *   university_logo, city, content, area, is_partner, ... }
 */

export function mapFaculties(items) {
  return asList(items)
    .map((item) => text(item?.faculty_name ?? item))
    .filter(Boolean)
    .map((facultyName) => ({ id: facultyName, name: facultyName }));
}

/**
 * /applicant/top_comments ->
 * [{ applicant_name, comment, service }]
 */
export function mapComment(dto, index) {
  const comment = text(firstField(dto, ['comment', 'content', 'review']));
  if (!comment) return null;

  const author = text(firstField(dto, ['applicant_name', 'applicantName', 'author'])) || 'Anonim';

  // Eyni ad iki dəfə gələ bilər (eyni şəxs iki rəy yaza bilər), ona görə
  // id təkcə addan qurulmur — index də əlavə olunur.
  return {
    id: `${author}-${index}`,
    text: comment,
    author,
    service: text(firstField(dto, ['service', 'service_name', 'serviceName'])),
  };
}


/**
 * /university/university_logos -> maps to logo objects for carousel.
 */
export function mapUniversityLogos(items) {
  return asList(items)
    .map((item) => {
      if (typeof item === 'string') {
        return { src: item, alt: '' };
      }
      const src =
        item?.logo_url ??
        item?.photo_url ??
        item?.image_url ??
        item?.url ??
        item?.src ??
        item?.university_logo ??
        item?.universityLogo ??
        '';
      const alt = item?.university_name ?? item?.universityName ?? item?.name ?? item?.alt ?? '';
      if (!src) return null;
      return { src, alt };
    })
    .filter(Boolean);
}
