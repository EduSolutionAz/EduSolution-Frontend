import { useEffect, useMemo, useRef, useState } from 'react';
import { getUniversitiesByCountry } from '../../services/contentApi';
import { FIELD_INPUT, FIELD_LABEL } from './fields';

const MAX_VISIBLE = 40;

/**
 * Searchable university picker. Loads the universities of the selected
 * country and filters them as the admin types. A name that is not in the
 * list can still be used, since new universities may not exist yet.
 */
export default function UniversityPicker({
  label = 'Universitet',
  value,
  onChange,
  countryName,
  disabled = false,
}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!countryName) {
      setOptions([]);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    getUniversitiesByCountry(countryName)
      .then((list) => {
        if (!active) return;
        setOptions(
          (list || [])
            .map((entry) => (typeof entry === 'string' ? entry : entry?.university_name))
            .filter(Boolean),
        );
      })
      .catch((err) => {
        if (!active) return;
        setOptions([]);
        setError(err?.message || 'Universitetlər yüklənmədi');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [countryName]);

  useEffect(() => {
    if (!open) return undefined;

    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((name) => name.toLowerCase().includes(q));
  }, [options, value]);

  const exactExists = options.some((name) => name === value.trim());
  const canUseTyped = value.trim().length > 0 && !exactExists;

  return (
    <div ref={wrapRef} className="relative">
      <label className={FIELD_LABEL} htmlFor="university-picker">
        {label}
      </label>

      <input
        id="university-picker"
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={loading ? 'Yüklənir...' : 'Universitet adı yazın və ya axtarın'}
        className={FIELD_INPUT}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="university-picker-list"
        aria-autocomplete="list"
      />

      {open && (
        <div
          id="university-picker-list"
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded border border-[#323643]/15 bg-white shadow-lg"
        >
          {error && <p className="px-3 py-2 text-[11px] text-red-600">{error}</p>}

          {!error && !loading && filtered.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-[#323643]/60">
              {options.length === 0
                ? 'Bu ölkədə universitet yoxdur.'
                : 'Uyğun universitet tapılmadı.'}
            </p>
          )}

          {!error &&
            filtered.slice(0, MAX_VISIBLE).map((name) => (
              <button
                key={name}
                type="button"
                role="option"
                aria-selected={name === value}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-[12px] hover:bg-[#26aec4]/10 ${
                  name === value ? 'bg-[#26aec4]/15 text-[#080d4a] font-medium' : 'text-[#323643]'
                }`}
              >
                {name}
              </button>
            ))}

          {filtered.length > MAX_VISIBLE && (
            <p className="px-3 py-2 text-[11px] text-[#323643]/50">
              {filtered.length - MAX_VISIBLE} universitet daha var — daraldmaq üçün yazın.
            </p>
          )}

          {canUseTyped && (
            <button
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => setOpen(false)}
              className="block w-full border-t border-[#323643]/10 px-3 py-2 text-left text-[12px] text-[#1a8a99] hover:bg-[#26aec4]/10"
            >
              &quot;{value.trim()}&quot; adı ilə davam et (siyahıda yoxdur)
            </button>
          )}
        </div>
      )}

      {!open && !disabled && (
        <p className="mt-1 text-[11px] text-[#323643]/50">
          {countryName
            ? `${options.length} universitet yükləndi — yazaraq axtarın.`
            : 'Əvvəlcə ölkə seçin.'}
        </p>
      )}
    </div>
  );
}
