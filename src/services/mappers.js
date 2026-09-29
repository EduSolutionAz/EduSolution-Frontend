import { slugify } from '../utils/format';

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

function text(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * /country/top_countries -> [{ country_name, university_count, visa_help,
 * dormitory_help, country_bg_url }]
 */
export function mapTopCountry(dto) {
  const name = text(dto?.country_name);
  if (!name) return null;

  const features = [];
  if (dto.visa_help) features.push('Visa Help');
  if (dto.dormitory_help) features.push('Dormitories');
  return {
    slug: slugify(name),
    name,
    flag: '',
    heroImage: text(dto.country_bg_url),
    heroAlt: name,
    card: {
      universityCount: Number(dto.university_count) || 0,
      tuitionFee: 0,
      features,
    },
    countryBgUrl: text(dto.country_bg_url),
    visaHelp: Boolean(dto.visa_help),
    dormitoryHelp: Boolean(dto.dormitory_help),
  };
}

/**
 * /country/all -> [{ country_name, university_count, is_visa_help,
 * is_dormitory_help }]. Different field names from /country/top_countries.
 */
export function mapAllCountry(dto) {
  const name = text(dto?.country_name);
  if (!name) return null;

  const features = [];
  if (dto.is_visa_help) features.push('Visa Help');
  if (dto.is_dormitory_help) features.push('Dormitories');

  return {
    slug: slugify(name),
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
export function mapUniversityLogos(items) {
  return asList(items)
    .map((item) => text(item?.university_logo_url))
    .filter(Boolean)
    .map((url) => ({
      src: url,
      alt: url.split('/').pop().replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' '),
    }));
}

/**
 * /country/{name} -> { title, photo_url, content, universities[], areas }
 */
export function mapCountry(dto) {
  const name = text(dto?.title);
  if (!name) return null;

  return {
    slug: slugify(name),
    name,
    heroImage: text(dto.photo_url),
    heroAlt: name,
    description: text(dto.content),
    areasText: text(dto.areas),
    universities: asList(dto.universities)
      .map((entry) => (typeof entry === 'string' ? entry : text(entry?.name)))
      .filter(Boolean)
      .map((universityName) => ({ id: universityName, universityName })),
    card: { universityCount: 0, tuitionFee: 0, features: [] },
    costs: { rental: { ...EMPTY_COSTS.rental }, monthly: { ...EMPTY_COSTS.monthly } },
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
 * /university/university_details/{name} ->
 * { title, content, faculties[], photo_url, view_url }
 */
export function mapUniversity(dto) {
  const name = text(dto?.title);
  if (!name) return null;

  return {
    id: name,
    universityName: name,
    universityLogo: text(dto.photo_url),
    universityType: 'PUBLIC',
    isPartner: false,
    shortDescription: '',
    city: '',
    area: '',
    universityFee: 0,
    semesterCount: 0,
    content: text(dto.content),
    viewUrl: text(dto.view_url),
    faculties: asList(dto.faculties)
      .map((entry) => (typeof entry === 'string' ? entry : text(entry?.faculty_name)))
      .filter(Boolean)
      .map((facultyName) => ({ id: facultyName, name: facultyName })),
  };
}

/**
 * /faculty/get_faculties -> [{ faculty_name }]
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
  const comment = text(dto?.comment);
  if (!comment) return null;
  return {
    id: text(dto.applicant_name) || `comment-${index}`,
    text: comment,
    author: text(dto.applicant_name) || 'Anonim',
    service: text(dto.service),
  };
}
