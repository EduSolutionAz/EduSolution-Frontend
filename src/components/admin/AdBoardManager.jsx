import { useState, useSyncExternalStore } from 'react';
import ImageUploadField from './ImageUploadField';
import { addAd, getAds, removeAd, subscribe } from '../../store/adminStore';
import {
  BTN_ACCENT,
  BTN_DELETE,
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from './fields';

const EMPTY_FORM = { imageUrl: '', imageFile: '', linkUrl: '', alt: '' };

export default function AdBoardManager() {
  const ads = useSyncExternalStore(subscribe, getAds, getAds);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl.trim() && !form.imageFile) return;

    const saved = addAd({
      imageUrl: form.imageUrl.trim(),
      imageFile: form.imageFile,
      linkUrl: form.linkUrl.trim(),
      alt: form.alt.trim(),
    });

    if (!saved) {
      window.alert('Yadda saxlamaq mümkün olmadı — brauzer yaddaş limiti dolub.');
      return;
    }

    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Reklamı silmək istəyirsiz?')) {
      removeAd(id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>Reklam Lövhəsi</h2>
        <button type="button" onClick={() => setShowForm((v) => !v)} className={BTN_ACCENT}>
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Şəkil fayl (tövsiyə olunan)"
              value={form.imageFile}
              onChange={(value) => setForm((prev) => ({ ...prev, imageFile: value }))}
              maxSize={900}
              hint="Fayl varsa URL-ə üstünlük verilir"
              previewClass="w-full h-[90px] object-contain"
              previewWrapper="w-full h-[90px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="ad-url">Şəkil URL</label>
            <input
              id="ad-url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="ad-link">Keçid linki</label>
            <input
              id="ad-link"
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="ad-alt">Alt mətn</label>
            <input
              id="ad-alt"
              name="alt"
              value={form.alt}
              onChange={handleChange}
              placeholder="Reklam təsviri"
              className={FIELD_INPUT}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" className={BTN_PRIMARY}>Yadda saxla</button>
          </div>
        </form>
      )}

      <ul className="space-y-3" role="list">
        {ads.map((ad) => (
          <li
            key={ad.id}
            className="bg-white rounded-md shadow px-4 py-3 flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={ad.imageFile || ad.imageUrl}
                alt={ad.alt || 'ad'}
                className="w-16 h-10 object-cover rounded"
                onError={(e) => {
                  e.target.style.visibility = 'hidden';
                }}
              />
              <div className="min-w-0">
                <span className="text-[#080d4a] font-semibold text-[13px] block">
                  {ad.alt || 'Alt mətn yoxdur'}
                </span>
                <span className="text-[#323643]/50 text-[11px]">
                  {ad.imageFile ? 'fayl' : ad.imageUrl || 'şəkil yoxdur'}
                </span>
                {ad.linkUrl && (
                  <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#323643]/50 text-[11px] underline block truncate"
                  >
                    {ad.linkUrl}
                  </a>
                )}
              </div>
            </div>
            <button type="button" onClick={() => handleDelete(ad.id)} className={BTN_DELETE}>
              Sil
            </button>
          </li>
        ))}
        {ads.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Hələ reklam yoxdur</li>
        )}
      </ul>
    </section>
  );
}
