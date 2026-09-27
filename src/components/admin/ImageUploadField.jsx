import { useId, useState } from 'react';
import { readImageFile } from '../../utils/imageFile';
import { FIELD_LABEL } from './fields';

export default function ImageUploadField({
  label,
  value,
  onChange,
  maxSize = 1400,
  hint,
  previewClass = 'w-full h-[130px] object-cover',
  previewWrapper = 'w-full h-[130px]',
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      onChange(await readImageFile(file, { maxSize }));
    } catch (err) {
      setError(err.message || 'Şəkil yüklənmədi');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className={FIELD_LABEL} htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={busy}
        className="block w-full text-[12px] text-[#323643]/70 file:mr-3 file:h-[36px] file:px-4 file:rounded file:border-0 file:bg-[#26aec4] file:text-[12px] file:font-semibold file:text-[#080d4a] file:cursor-pointer hover:file:bg-[#3cc3d8] disabled:opacity-60"
      />

      {hint && <p className="mt-1 text-[10px] text-[#323643]/50">{hint}</p>}
      {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}

      {value ? (
        <div className="mt-2 flex items-center gap-3">
          <div className={`${previewWrapper} overflow-hidden rounded bg-white border border-black/5`}>
            <img src={value} alt="" className={previewClass} />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 px-3 py-1 text-red-600 text-[11px] font-medium hover:bg-red-50 rounded transition"
          >
            Sil
          </button>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-[#323643]/40">
          {busy ? 'Yüklənir...' : 'Fayl seçilməyib'}
        </p>
      )}
    </div>
  );
}
