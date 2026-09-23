import { useState, useSyncExternalStore } from 'react';
import { addAd, getAds, removeAd, subscribe } from '../../store/adminStore';

export default function AdBoardManager() {
  const ads = useSyncExternalStore(subscribe, getAds, getAds);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ imageUrl: '', linkUrl: '', alt: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) return;
    addAd({ imageUrl: form.imageUrl.trim(), linkUrl: form.linkUrl.trim(), alt: form.alt.trim() });
    setForm({ imageUrl: '', linkUrl: '', alt: '' });
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
        <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
          Reklam Lövhəsi
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-5 py-2 bg-[#26aec4] text-[#080d4a] font-accent font-semibold rounded-full hover:bg-[#3cc3d8] transition text-[13px]"
        >
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-[#323643]/70 mb-1">
              Şəkil URL *
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
              className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#323643]/70 mb-1">
              Keçid linki
            </label>
            <input
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#323643]/70 mb-1">
              Alt mətn
            </label>
            <input
              name="alt"
              value={form.alt}
              onChange={handleChange}
              placeholder="Reklam təsviri"
              className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 text-[12px]"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#080d4a] text-white text-[12px] rounded-full hover:bg-[#141c63] transition"
            >
              Yadda saxla
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3" role="list">
        {ads.map((ad) => (
          <li
            key={ad.id}
            className="bg-white rounded-md shadow px-4 py-3 flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={ad.imageUrl}
                alt={ad.alt || 'ad'}
                className="w-16 h-10 object-cover rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64x40?text=no+image';
                }}
              />
              <div>
                <span className="text-[#080d4a] font-semibold text-[13px] block">
                  {ad.alt || 'Alt mətn yoxdur'}
                </span>
                {ad.linkUrl && (
                  <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#323643]/50 text-[11px] underline"
                  >
                    {ad.linkUrl}
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(ad.id)}
              className="px-3 py-1 text-red-600 text-[12px] font-medium hover:bg-red-50 rounded transition"
            >
              Sil
            </button>
          </li>
        ))}
        {ads.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">
            Hələ reklam yoxdur
          </li>
        )}
      </ul>
    </section>
  );
}
