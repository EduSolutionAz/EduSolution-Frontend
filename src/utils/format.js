export const FEATURE_OPTIONS = [
  'Visa Help',
  'Dormitories',
  'Work Permit',
  'Residence Permit',
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
