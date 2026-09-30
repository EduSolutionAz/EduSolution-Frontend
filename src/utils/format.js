// Mirrors CountryAddRequestDTO on the backend: it accepts only these three
// flags, there is no residence or work permit field.
export const FEATURE_OPTIONS = [
  { value: 'isVisaHelp', label: 'Visa Help' },
  { value: 'isDormitoryHelp', label: 'Dormitories' },
  { value: 'isTopList', label: 'Top List' },
];

export const UNIVERSITY_TYPES = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
];

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatUniversityCount(value) {
  const count = Math.round(toNumber(value));
  return count > 0 ? `${count}+ universities` : '';
}

export function formatUsd(value) {
  const amount = Math.round(toNumber(value));
  return amount > 0 ? `${amount}$` : 'Free';
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
  return type === 'PRIVATE' ? 'Private' : 'Public';
}

export function isImageFlag(flag) {
  return (
    typeof flag === 'string' &&
    (flag.startsWith('data:image') || /^https?:\/\//i.test(flag))
  );
}

const SLUG_MAP = {
  ğ: 'g',
  ı: 'i',
  İ: 'i',
  ə: 'e',
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
