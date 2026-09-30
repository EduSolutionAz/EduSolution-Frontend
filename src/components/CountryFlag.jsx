import { useState } from 'react';
import { gradientFor, isImageFlag, universityInitials } from '../utils/format';

export default function CountryFlag({ country, flag, className = '', emojiClass = '' }) {
  const value = flag !== undefined ? flag : country && country.flag;
  const name = (country && country.name) || '';
  const [broken, setBroken] = useState(false);

  if (isImageFlag(value) && !broken) {
    return (
      <img
        src={value}
        alt={name}
        className={`object-contain shrink-0 ${className}`}
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }

  if (!value && !name) return null;

  // A missing or broken image falls back to the country's initials so the
  // layout does not collapse.
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-sm font-heading font-bold text-white ${className}`}
      style={{ background: gradientFor(name), minWidth: '1.6em', lineHeight: 1 }}
      aria-label={name}
      role="img"
    >
      {universityInitials(name) || (typeof value === 'string' ? value.slice(0, 2) : '')}
      {value && emojiClass ? <span className={emojiClass}>{value}</span> : null}
    </span>
  );
}
