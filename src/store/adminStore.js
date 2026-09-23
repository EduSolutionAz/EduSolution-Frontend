import { createId } from '../utils/id';
import { countries as seedCountries } from '../data/countries';

const STORAGE_KEY = 'eduSoliton_admin_v1';

const DEFAULT_STATE = {
  ads: [],
  prizes: [],
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
  } catch {
    // quota exceeded etc.
  }
}

let state = null;
const listeners = new Set();

function migrateSeed() {
  const countries = seedCountries.map((c) => ({
    id: createId('ctry'),
    slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: c.name,
    flag: c.flag || '',
    card: c.card || {
      universityCount: '0',
      tuitionTag: '',
      features: [],
    },
    heroImage: c.heroImage || '',
    heroAlt: c.heroAlt || c.name,
    description: c.description || '',
    universities: (c.universities || []).map((u) =>
      typeof u === 'string'
        ? { id: createId('univ'), name: u, faculties: [] }
        : { ...u, faculties: u.faculties || [] }
    ),
    costs: c.costs || {
      university: { value: '', label: 'University Cost', note: '' },
      rental: { value: '', label: 'Rental Fee', note: '' },
      monthly: { value: '', label: 'Monthly Spending', note: '' },
    },
    areasText: c.areasText || '',
  }));
  return { ...DEFAULT_STATE, countries };
}

function ensureState() {
  if (!state) {
    state = loadFromStorage() || migrateSeed();
    if (!loadFromStorage()) {
      saveToStorage(state);
    }
  }
  return state;
}

function emit() {
  listeners.forEach((fn) => fn(state));
}

function cloneState() {
  const s = ensureState();
  return JSON.parse(JSON.stringify(s));
}

function commit(next) {
  state = next;
  saveToStorage(state);
  emit();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return cloneState();
}

export function getCountries() {
  return ensureState().countries;
}

export function getCountryBySlug(slug) {
  return ensureState().countries.find((c) => c.slug === slug);
}

export function addCountry(country) {
  const s = cloneState();
  s.countries.push({
    id: createId('ctry'),
    slug: country.slug || country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: country.name,
    flag: country.flag || '',
    card: country.card || {
      universityCount: country.universityCount || '',
      tuitionTag: country.tuitionTag || '',
      features: country.features || [],
    },
    heroImage: country.heroImage || '',
    heroAlt: country.heroAlt || country.name,
    description: country.description || '',
    universities: [],
    costs: country.costs || {
      university: { value: '', label: 'University Cost', note: '' },
      rental: { value: '', label: 'Rental Fee', note: '' },
      monthly: { value: '', label: 'Monthly Spending', note: '' },
    },
    areasText: country.areasText || '',
  });
  commit(s);
}

export function removeCountry(slug) {
  const s = cloneState();
  s.countries = s.countries.filter((c) => c.slug !== slug);
  commit(s);
}

export function updateCountry(slug, patch) {
  const s = cloneState();
  const idx = s.countries.findIndex((c) => c.slug === slug);
  if (idx >= 0) {
    s.countries[idx] = { ...s.countries[idx], ...patch };
    commit(s);
  }
}

export function getUniversities(countrySlug) {
  const c = getCountryBySlug(countrySlug);
  return c ? c.universities : [];
}

export function addUniversity(countrySlug, name) {
  const s = cloneState();
  const c = s.countries.find((country) => country.slug === countrySlug);
  if (c) {
    c.universities.push({ id: createId('univ'), name, faculties: [] });
    commit(s);
  }
}

export function removeUniversity(countrySlug, universityId) {
  const s = cloneState();
  const c = s.countries.find((country) => country.slug === countrySlug);
  if (c) {
    c.universities = c.universities.filter((u) => u.id !== universityId);
    commit(s);
  }
}

export function getFaculties(countrySlug, universityId) {
  const c = getCountryBySlug(countrySlug);
  const u = c?.universities.find((uni) => uni.id === universityId);
  return u ? u.faculties : [];
}

export function addFaculty(countrySlug, universityId, name) {
  const s = cloneState();
  const c = s.countries.find((country) => country.slug === countrySlug);
  if (c) {
    const u = c.universities.find((uni) => uni.id === universityId);
    if (u) {
      u.faculties.push({ id: createId('fac'), name });
      commit(s);
    }
  }
}

export function removeFaculty(countrySlug, universityId, facultyId) {
  const s = cloneState();
  const c = s.countries.find((country) => country.slug === countrySlug);
  if (c) {
    const u = c.universities.find((uni) => uni.id === universityId);
    if (u) {
      u.faculties = u.faculties.filter((f) => f.id !== facultyId);
      commit(s);
    }
  }
}

export function getAds() {
  return ensureState().ads;
}

export function addAd(ad) {
  const s = cloneState();
  s.ads.push({
    id: createId('ad'),
    imageUrl: '',
    linkUrl: '',
    alt: '',
    ...ad,
  });
  commit(s);
}

export function removeAd(id) {
  const s = cloneState();
  s.ads = s.ads.filter((a) => a.id !== id);
  commit(s);
}

export function getPrizes() {
  return ensureState().prizes;
}

export function addPrize(name, probability = 0) {
  const s = cloneState();
  s.prizes.push({ id: createId('prize'), name, probability });
  commit(s);
}

export function removePrize(id) {
  const s = cloneState();
  s.prizes = s.prizes.filter((p) => p.id !== id);
  commit(s);
}

export function getComments() {
  return ensureState().comments;
}

export function generateCommentUrl(text = '', countrySlug = '') {
  const s = cloneState();
  const id = createId('cm');
  const url = `${window.location.origin}/comment/${id}`;
  const comment = {
    id,
    url,
    text,
    countrySlug,
    createdAt: new Date().toISOString(),
  };
  s.comments.push(comment);
  commit(s);
  return comment;
}

export function removeComment(id) {
  const s = cloneState();
  s.comments = s.comments.filter((c) => c.id !== id);
  commit(s);
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  state = null;
  const fresh = migrateSeed();
  state = fresh;
  saveToStorage(state);
  emit();
}
