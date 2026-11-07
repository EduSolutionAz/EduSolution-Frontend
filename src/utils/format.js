// Mirrors CountryAddRequestDTO on the backend: it accepts only these three
// flags, there is no residence or work permit field.
export const FEATURE_OPTIONS = [
  { value: 'isVisaHelp', label: 'Viza dəstəyi' },
  { value: 'isDormitoryHelp', label: 'Yataqxanalar' },
  { value: 'isTopList', label: 'Top siyahı' },
];

export const UNIVERSITY_TYPES = [
  { value: 'PUBLIC', label: 'Dövlət' },
  { value: 'PRIVATE', label: 'Özəl' },
];

export function capitalizeFirst(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return text.charAt(0).toLocaleUpperCase('az') + text.slice(1);
}

/**
 * The previous ad form sent every text value twice (once in the query string
 * and once as a multipart field). Spring joined the two copies with a comma,
 * so old records can hold "Title,Title" (detail endpoint) or "title title"
 * (list endpoint). Collapse such exact repeats for display only — the stored
 * value is left untouched, since the backend uses it as the ad id.
 */
function collapseRepeatedAdText(text, { splitWords = false } = {}) {
  if (!text) return '';

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== ',') continue;
    const left = text.slice(0, i).trim();
    const right = text.slice(i + 1).trim();
    if (left && left === right) return left;
  }

  if (splitWords) {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.length % 2 === 0) {
      const half = words.length / 2;
      const left = words.slice(0, half).join(' ');
      const right = words.slice(half).join(' ');
      if (left.toLowerCase() === right.toLowerCase()) return left;
    }
  }

  return text;
}

/** Ad titles come back lowercased from GET /ad/all; show them capitalized. */
export function formatAdTitle(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return capitalizeFirst(collapseRepeatedAdText(text, { splitWords: true }));
}

/** Removes a duplicated ad body left by the old double-submit bug. */
export function cleanAdDescription(value) {
  return collapseRepeatedAdText(String(value ?? '').trim());
}

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatUniversityCount(value) {
  const count = Math.round(toNumber(value));
  return count > 0 ? `${count}+ universitet` : '';
}

export function formatUsd(value) {
  const amount = Math.round(toNumber(value));
  return amount > 0 ? `${amount}$` : 'Pulsuz';
}

export function formatUsdAmount(value) {
  const amount = Math.round(toNumber(value));
  return amount > 0 ? `${new Intl.NumberFormat('en-US').format(amount)}$` : 'Pulsuz';
}

export function formatSemesterCount(value) {
  const semesters = Math.round(toNumber(value));
  return semesters > 0 ? String(semesters) : '';
}

export function getUniversityName(university) {
  if (!university) return '';
  return university.universityName || university.name || '';
}

export function getUniversityTypeLabel(type) {
  return normalizeUniversityType(type) === 'PRIVATE' ? 'Özəl' : 'Dövlət';
}

/**
 * Normalizes a university type value from the backend into the canonical
 * PUBLIC | PRIVATE enum this app uses.
 *
 * Handles both key casings (`university_type` / `universityType`) and case
 * differences ("private", "Private", "PRIVATE"). Any unrecognized value
 * (including empty/unknown) falls back to PUBLIC.
 */
export function normalizeUniversityType(value) {
  return String(value ?? '').trim().toLowerCase() === 'private' ? 'PRIVATE' : 'PUBLIC';
}

export function isImageFlag(flag) {
  return (
    typeof flag === 'string' &&
    (flag.startsWith('data:image') || /^https?:\/\//i.test(flag))
  );
}

const SLUG_MAP = {
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  I: 'i',
  İ: 'i',
  ə: 'e',
  Ə: 'e',
  ý: 'y',
  Ý: 'y',
};

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ğĞıİəƏýÝ]/g, (char) => SLUG_MAP[char] || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function universityInitials(value) {
  const name = typeof value === 'string' ? value : getUniversityName(value);

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

const GRADIENTS = [
  'linear-gradient(135deg, #080d4a 0%, #1a2e5a 100%)',
  'linear-gradient(135deg, #1a2e5a 0%, #26aec4 100%)',
  'linear-gradient(135deg, #2b3a67 0%, #4a5b96 100%)',
  'linear-gradient(135deg, #14204d 0%, #35507e 100%)',
];

/** Stable gradient per name so a missing image still looks intentional. */
export function gradientFor(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
