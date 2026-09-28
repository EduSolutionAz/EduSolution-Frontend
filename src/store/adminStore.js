import { createId } from '../utils/id';
import { countries as seedCountries } from '../data/countries';
import { faqs as seedFaqs } from '../data/faqs';
import {
  FEATURE_OPTIONS,
  slugify,
  toNumber,
} from '../utils/format';

const STORAGE_KEY = 'eduSoliton_admin_v1';
const SCHEMA_VERSION = 2;

const DEFAULT_COSTS = {
  rental: { value: '', label: 'Rental Fee', note: '' },
  monthly: { value: '', label: 'Monthly Spending', note: '' },
};

const DEFAULT_STATE = {
  schemaVersion: SCHEMA_VERSION,
  ads: [],
  prizes: [],
  faqs: [],
  applicants: [],
  applicantGenerations: [],
  countries: [],
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function normalizeFeatures(features) {
  if (!Array.isArray(features)) return [];
  return FEATURE_OPTIONS.filter((option) => features.includes(option));
}

function normalizeCost(cost, fallback) {
  return {
    value: (cost && cost.value) || '',
    label: (cost && cost.label) || fallback.label,
    note: (cost && cost.note) || '',
  };
}

function normalizeCosts(costs) {
  return {
    rental: normalizeCost(costs && costs.rental, DEFAULT_COSTS.rental),
    monthly: normalizeCost(costs && costs.monthly, DEFAULT_COSTS.monthly),
  };
}

function normalizeUniversity(university, country) {
  const source = typeof university === 'string' ? { universityName: university } : university || {};

  return {
    id: source.id || createId('univ'),
    universityName: source.universityName || source.name || '',
    countryName: source.countryName || (country && country.name) || '',
    countrySlug: source.countrySlug || (country && country.slug) || '',
    universityType: source.universityType === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
    shortDescription: source.shortDescription || '',
    universityLogo: source.universityLogo || '',
    city: source.city || '',
    content: source.content || '',
    area: source.area || '',
    isPartner: Boolean(source.isPartner),
    universityFee: toNumber(source.universityFee),
    semesterCount: toNumber(source.semesterCount) || 6,
    faculties: Array.isArray(source.faculties) ? source.faculties : [],
  };
}

function normalizeCountry(country) {
  const card = country.card || {};

  return {
    id: country.id || createId('ctry'),
    slug: country.slug || slugify(country.name),
    name: country.name,
    flag: country.flag || '',
    card: {
      universityCount: toNumber(
        card.universityCount !== undefined ? card.universityCount : country.universityCount,
      ),
      tuitionFee: toNumber(
        card.tuitionFee !== undefined ? card.tuitionFee : country.tuitionFee,
      ),
      features: normalizeFeatures(
        card.features !== undefined ? card.features : country.features,
      ),
    },
    heroImage: country.heroImage || '',
    heroAlt: country.heroAlt || country.name || '',
    description: country.description || '',
    universities: (country.universities || []).map((u) => normalizeUniversity(u, country)),
    costs: normalizeCosts(country.costs),
    areasText: country.areasText || '',
  };
}

function normalizeFaq(faq) {
  return {
    id: faq.id || createId('faq'),
    question: faq.question || '',
    answer: faq.answer || '',
  };
}

function migrateSeed() {
  return {
    ...DEFAULT_STATE,
    faqs: seedFaqs.map(normalizeFaq),
    countries: seedCountries.map((country) => {
      const normalized = normalizeCountry(country);
      normalized.universities = normalized.universities.map((university, index) => ({
        ...university,
        isPartner: index === 0,
      }));
      return normalized;
    }),
  };
}

function normalizeApplicant(applicant) {
  return {
    id: applicant.id || createId('app'),
    applicantName: applicant.applicantName || 'Anonim',
    applicantEmail: applicant.applicantEmail || '',
    applicantServiceType: applicant.applicantServiceType || '',
    comment: applicant.comment || '',
    createdAt: applicant.createdAt || new Date().toISOString(),
  };
}

function normalizeApplicants(stored) {
  const current = Array.isArray(stored.applicants) ? stored.applicants : [];
  if (current.length > 0) return current.map(normalizeApplicant);

  const legacy = Array.isArray(stored.comments) ? stored.comments : [];
  return legacy
    .filter((item) => item && item.text)
    .map((item) =>
      normalizeApplicant({
        id: item.id,
        comment: item.text,
        createdAt: item.createdAt,
      }),
    );
}

function migrateStored(stored) {
  return {
    schemaVersion: SCHEMA_VERSION,
    ads: stored.ads || [],
    prizes: stored.prizes || [],
    applicants: normalizeApplicants(stored),
    applicantGenerations: Array.isArray(stored.applicantGenerations) ? stored.applicantGenerations : [],
    faqs: Array.isArray(stored.faqs) ? stored.faqs.map(normalizeFaq) : seedFaqs.map(normalizeFaq),
    countries: (stored.countries || []).map(normalizeCountry),
  };
}

let state = null;
const listeners = new Set();

function ensureState() {
  if (!state) {
    const stored = loadFromStorage();
    state =
      stored && Array.isArray(stored.countries) ? migrateStored(stored) : migrateSeed();
  }
  return state;
}

function emit() {
  listeners.forEach((fn) => fn(state));
}

function cloneState() {
  return JSON.parse(JSON.stringify(ensureState()));
}

function commit(next) {
  state = next;
  const saved = saveToStorage(state);
  emit();
  return saved;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getCountries() {
  return ensureState().countries;
}

export function getCountryBySlug(slug) {
  return ensureState().countries.find((c) => c.slug === slug);
}

export function addCountry(country) {
  const s = cloneState();
  s.countries.push(normalizeCountry({ ...country, id: createId('ctry') }));
  return commit(s);
}

export function removeCountry(slug) {
  const s = cloneState();
  s.countries = s.countries.filter((c) => c.slug !== slug);
  return commit(s);
}

export function updateCountry(slug, patch) {
  const s = cloneState();
  const idx = s.countries.findIndex((c) => c.slug === slug);
  if (idx < 0) return false;
  s.countries[idx] = normalizeCountry({ ...s.countries[idx], ...patch, slug, id: s.countries[idx].id });
  return commit(s);
}

export function getUniversities(countrySlug) {
  const country = getCountryBySlug(countrySlug);
  return country ? country.universities : [];
}

export function getUniversityById(countrySlug, universityId) {
  return getUniversities(countrySlug).find((u) => u.id === universityId);
}

export function addUniversity(countrySlug, data) {
  const s = cloneState();
  const country = s.countries.find((c) => c.slug === countrySlug);
  if (!country) return false;

  country.universities.push(
    normalizeUniversity({ ...data, id: createId('univ'), countrySlug }, country),
  );
  return commit(s);
}

export function updateUniversity(countrySlug, universityId, patch) {
  const s = cloneState();
  const country = s.countries.find((c) => c.slug === countrySlug);
  if (!country) return false;

  const idx = country.universities.findIndex((u) => u.id === universityId);
  if (idx < 0) return false;

  country.universities[idx] = normalizeUniversity(
    { ...country.universities[idx], ...patch, id: universityId, countrySlug },
    country,
  );
  return commit(s);
}

export function removeUniversity(countrySlug, universityId) {
  const s = cloneState();
  const country = s.countries.find((c) => c.slug === countrySlug);
  if (!country) return false;

  country.universities = country.universities.filter((u) => u.id !== universityId);
  return commit(s);
}

export function getFaculties(countrySlug, universityId) {
  const university = getUniversityById(countrySlug, universityId);
  return university ? university.faculties : [];
}

export function addFaculty(countrySlug, universityId, name) {
  const s = cloneState();
  const country = s.countries.find((c) => c.slug === countrySlug);
  const university = country && country.universities.find((u) => u.id === universityId);
  if (!university) return false;

  university.faculties.push({ id: createId('fac'), name });
  return commit(s);
}

export function removeFaculty(countrySlug, universityId, facultyId) {
  const s = cloneState();
  const country = s.countries.find((c) => c.slug === countrySlug);
  const university = country && country.universities.find((u) => u.id === universityId);
  if (!university) return false;

  university.faculties = university.faculties.filter((f) => f.id !== facultyId);
  return commit(s);
}

export function getAds() {
  return ensureState().ads;
}

export function addAd(ad) {
  const s = cloneState();
  s.ads.push({
    id: createId('ad'),
    imageUrl: '',
    imageFile: '',
    linkUrl: '',
    alt: '',
    ...ad,
  });
  return commit(s);
}

export function removeAd(id) {
  const s = cloneState();
  s.ads = s.ads.filter((a) => a.id !== id);
  return commit(s);
}

export function getPrizes() {
  return ensureState().prizes;
}

export function addPrize(name) {
  const s = cloneState();
  s.prizes.push({ id: createId('prize'), name });
  return commit(s);
}

export function removePrize(id) {
  const s = cloneState();
  s.prizes = s.prizes.filter((p) => p.id !== id);
  return commit(s);
}

export function getFaqs() {
  return ensureState().faqs;
}

export function addFaq(question, answer) {
  const s = cloneState();
  s.faqs.push(normalizeFaq({ id: createId('faq'), question, answer }));
  return commit(s);
}

export function updateFaq(id, patch) {
  const s = cloneState();
  const idx = s.faqs.findIndex((f) => f.id === id);
  if (idx < 0) return false;

  s.faqs[idx] = normalizeFaq({ ...s.faqs[idx], ...patch, id });
  return commit(s);
}

export function moveFaq(id, direction) {
  const s = cloneState();
  const idx = s.faqs.findIndex((f) => f.id === id);
  const target = idx + direction;
  if (idx < 0 || target < 0 || target >= s.faqs.length) return false;

  const [item] = s.faqs.splice(idx, 1);
  s.faqs.splice(target, 0, item);
  return commit(s);
}

export function removeFaq(id) {
  const s = cloneState();
  s.faqs = s.faqs.filter((f) => f.id !== id);
  return commit(s);
}

export function getApplicants() {
  return ensureState().applicants;
}

export function getApplicantGenerations() {
  return ensureState().applicantGenerations;
}

export function findGenerationByTokenHash(tokenHash) {
  return ensureState().applicantGenerations.find((g) => g.tokenHash === tokenHash) ?? null;
}

export function addApplicantGeneration(generation) {
  const s = cloneState();
  s.applicantGenerations.unshift(generation);
  return commit(s);
}

export function markGenerationUsed(id, used = true) {
  const s = cloneState();
  const index = s.applicantGenerations.findIndex((g) => g.id === id);
  if (index < 0) return false;

  s.applicantGenerations[index].used = used;
  return commit(s);
}

export function addApplicant(applicant) {
  const s = cloneState();
  s.applicants.unshift(applicant);
  return commit(s);
}

export function removeGeneration(id) {
  const s = cloneState();
  s.applicantGenerations = s.applicantGenerations.filter((g) => g.id !== id);
  return commit(s);
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  state = migrateSeed();
  saveToStorage(state);
  emit();
}
