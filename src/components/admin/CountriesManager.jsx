import { useState, useSyncExternalStore } from 'react';
import {
  addCountry,
  getCountries,
  removeCountry,
  subscribe,
} from '../../store/adminStore';

export default function CountriesManager() {
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    flag: '',
    slug: '',
    tuitionTag: '',
    universityCount: '',
    features: '',
    heroImage: '',
    heroAlt: '',
    description: '',
    areasText: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCountry({
      name: form.name,
      slug: form.slug,
      flag: form.flag,
      universityCount: form.universityCount || '',
      tuitionTag: form.tuitionTag || '',
      features: form.features
        ? form.features.split(',').map((f) => f.trim())
        : [],
      heroImage: form.heroImage,
      heroAlt: form.heroAlt,
      description: form.description,
      areasText: form.areasText,
    });
    setForm({
      name: '',
      flag: '',
      slug: '',
      tuitionTag: '',
      universityCount: '',
      features: '',
      heroImage: '',
      heroAlt: '',
      description: '',
      areasText: '',
    });
    setShowForm(false);
  };

  const handleDelete = (slug) => {
    if (window.confirm('Bu ölkəni silmək istəyirsiz?')) {
      removeCountry(slug);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
          Ölkələr
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
          <div>
            <label className="text-[11px] text-[#323643]/70">Ölkə adı *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#323643]/70">Bayraq emoji</label>
            <input
              name="flag"
              value={form.flag}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-[#323643]/70">Slug (URL)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="avtomatik doldurulur"
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#323643]/70">Universitet sayı</label>
            <input
              name="universityCount"
              value={form.universityCount}
              onChange={handleChange}
              placeholder="400+ universities"
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#323643]/70">Təlim ücreti etiketi</label>
            <input
              name="tuitionTag"
              value={form.tuitionTag}
              onChange={handleChange}
              placeholder="Free Tuition Fee"
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-[#323643]/70">Xüsusiyyətlər (vergül ilə)</label>
            <input
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="Visa Help, Dormitories"
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-[#323643]/70">Hero şəkil URL</label>
            <input
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#323643]/70">Hero alt mətni</label>
            <input
              name="heroAlt"
              value={form.heroAlt}
              onChange={handleChange}
              className="w-full h-[40px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-[#323643]/70">Təsvir</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#f6eeee] rounded px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4] resize-y"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-[#323643]/70">Ərazilər mətni</label>
            <textarea
              name="areasText"
              value={form.areasText}
              onChange={handleChange}
              rows={2}
              className="w-full bg-[#f6eeee] rounded px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4] resize-y"
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

      <ul className="space-y-2" role="list">
        {countries.map((c) => (
          <li
            key={c.slug}
            className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-[20px]">{c.flag || ''}</span>
              <div>
                <span className="text-[#080d4a] font-semibold text-[14px]">
                  {c.name}
                </span>
                <span className="text-[#323643]/50 text-[11px]"> /{c.slug}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(c.slug)}
              className="px-3 py-1 text-red-600 text-[12px] font-medium hover:bg-red-50 rounded transition"
            >
              Sil
            </button>
          </li>
        ))}
        {countries.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">
            Heç bir ölkə yoxdur
          </li>
        )}
      </ul>
    </section>
  );
}
