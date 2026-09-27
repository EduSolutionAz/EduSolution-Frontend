import { isImageFlag } from '../utils/format';

export default function CountryFlag({ country, flag, className = '', emojiClass = '' }) {
  const value = flag !== undefined ? flag : country && country.flag;
  const name = (country && country.name) || '';

  if (isImageFlag(value)) {
    return (
      <img
        src={value}
        alt={name}
        className={`object-contain shrink-0 ${className}`}
        loading="lazy"
      />
    );
  }

  if (!value) return null;

  return (
    <span className={`leading-none shrink-0 ${emojiClass || className}`} aria-label={name} role="img">
      {value}
    </span>
  );
}
