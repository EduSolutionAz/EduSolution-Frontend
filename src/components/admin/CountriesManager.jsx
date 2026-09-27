import { useState, useSyncExternalStore } from 'react';
import CountryFlag from '../CountryFlag';
import ImageUploadField from './ImageUploadField';
import {
  addCountry,
  getCountries,
  removeCountry,
  subscribe,
  updateCountry,
} from '../../store/adminStore';
import { FEATURE_OPTIONS, formatUniversityCount, formatUsd, slugify } from '../../utils/format';
import {
  BTN_ACCENT,
  BTN_DELETE,
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  FIELD_TEXTAREA,
  SECTION_TITLE,
} from './fields';

const EMPTY_FORM = {
  name: '',
  flag: '',
  slug: '',
  universityCount: '',
  tuitionFee: '',
  features: [],
  heroImage: '',
  heroAlt: '',
  description: '',
  areasText: '',
};

function formFromCountry(country) {
  return {
    name: country.name,
    flag: country.flag,
    slug: country.slug,
    universityCount: String(country.card.universityCount || ''),
    tuitionFee: String(country.card.tuitionFee || ''),
    features: [...country.card.features],
    heroImage: country.heroImage,
    heroAlt: country.heroAlt,
    description: country.description,
    areasText: country.areasText,
  };
}

export default function CountriesManager() {
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingSlug);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFeature = (option) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(option)
        ? prev.features.filter((f) => f !== option)
        : [...prev.features, option],
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSlug('');
    setForm(EMPTY_FORM);
  };

  const handleEdit = (country) => {
    setForm(formFromCountry(country));
    setEditingSlug(country.slug);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      flag: form.flag,
      card: {
        universityCount: form.universityCount,
        tuitionFee: form.tuitionFee,
        features: form.features,
      },
      heroImage: form.heroImage,
      heroAlt: form.heroAlt,
      description: form.description,
      areasText: form.areasText,
    };

    if (isEditing) {
      const saved = updateCountry(editingSlug, payload);
      if (!saved) window.alert('Yenilənmə mümkün olmadı — ölkə tapılmadı.');
      closeForm();
      return;
    }

    const slug = slugify(form.slug || form.name);
    if (!slug) {
      window.alert('Slug avtomatik yaradıla bilmədi — adı ingilis hərfləri ilə yazın.');
      return;
    }
    if (countries.some((c) => c.slug === slug)) {
      window.alert(`"/${slug}" slug-u artıq mövcuddur. Başqa slug seçin.`);
      return;
    }

    const saved = addCountry({ ...payload, slug });
    if (!saved) {
      window.alert('Yadda saxlamaq mümkün olmadı — brauzer yaddaş limiti dolub.');
      return;
    }

    closeForm();
  };

  const handleDelete = (slug) => {
    const country = countries.find((c) => c.slug === slug);
    const warning = country && country.universities.length > 0
      ? `"${country.name}" silinsin? Bu ölkədəki ${country.universities.length} universitet də silinəcək.`
      : 'Bu ölkəni silmək istəyirsiz?';

    if (window.confirm(warning)) removeCountry(slug);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>
          Ölkələr
          {isEditing && (
            <span className="ml-2 align-middle text-[12px] font-accent font-medium text-[#26aec4]">
              Redaktə: {form.name}
            </span>
          )}
        </h2>
        <button type="button" onClick={() => (showForm ? closeForm() : setShowForm(true))} className={BTN_ACCENT}>
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div>
            <label className={FIELD_LABEL} htmlFor="country-name">Ölkə adı *</label>
            <input id="country-name" name="name" value={form.name} onChange={handleChange} required className={FIELD_INPUT} />
          </div>

          <div>
            <ImageUploadField
              label="Bayraq (fayl)"
              value={form.flag}
              onChange={(value) => setForm((prev) => ({ ...prev, flag: value }))}
              maxSize={96}
              hint="JPG/PNG/ICO, avtomatik 96px-ə kiçildilir"
              previewClass="w-full h-[70px] object-contain"
              previewWrapper="w-[110px] h-[70px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-slug">Slug (URL)</label>
            <input
              id="country-slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="avtomatik doldurulur"
              className={FIELD_INPUT}
              disabled={isEditing}
              title={isEditing ? 'Redaktə zamanı slug dəyişmək mümkün deyil' : undefined}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-count">Universitet sayı</label>
            <div className="relative">
              <input
                id="country-count"
                name="universityCount"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.universityCount}
                onChange={handleChange}
                placeholder="400"
                className={`${FIELD_INPUT} pr-[104px]`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#323643]/50">
                + universities
              </span>
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-fee">Təlim ücreti</label>
            <div className="relative">
              <input
                id="country-fee"
                name="tuitionFee"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.tuitionFee}
                onChange={handleChange}
                placeholder="0 = pulsuz"
                className={`${FIELD_INPUT} pr-[52px]`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#323643]/50">
                $
              </span>
            </div>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className={FIELD_LABEL}>Xüsusiyyətlər</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {FEATURE_OPTIONS.map((option) => (
                <label key={option} className="inline-flex items-center gap-2 text-[13px] text-[#323643] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.features.includes(option)}
                    onChange={() => toggleFeature(option)}
                    className="w-4 h-4 accent-[#26aec4]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Hero şəkil (fayl)"
              value={form.heroImage}
              onChange={(value) => setForm((prev) => ({ ...prev, heroImage: value }))}
              maxSize={1400}
              hint="JPG/PNG, avtomatik 1400px-ə kiçildilir"
              previewClass="w-full h-[120px] object-cover"
              previewWrapper="w-full h-[120px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-hero-alt">Hero alt mətni</label>
            <input id="country-hero-alt" name="heroAlt" value={form.heroAlt} onChange={handleChange} className={FIELD_INPUT} />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-desc">Təsvir</label>
            <textarea id="country-desc" name="description" value={form.description} onChange={handleChange} rows={3} className={FIELD_TEXTAREA} />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-areas">Ərazilər mətni</label>
            <textarea id="country-areas" name="areasText" value={form.areasText} onChange={handleChange} rows={2} className={FIELD_TEXTAREA} />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={closeForm} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" className={BTN_PRIMARY}>
              {isEditing ? 'Yenilə' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2" role="list">
        {countries.map((country) => (
          <li key={country.slug} className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <CountryFlag
                country={country}
                className="w-[26px] h-[18px]"
                emojiClass="text-[20px]"
              />
              <div className="min-w-0">
                <span className="text-[#080d4a] font-semibold text-[14px] block truncate">
                  {country.name}
                </span>
                <span className="text-[#323643]/50 text-[11px]">
                  {formatUniversityCount(country.card.universityCount) || 'universitet sayı yoxdur'}
                  {' · '}
                  {formatUsd(country.card.tuitionFee)}
                  {country.card.features.length > 0 && ` · ${country.card.features.join(', ')}`}
                  {` · ${country.universities.length} universitet`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(country)}
                className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition"
              >
                Redaktə
              </button>
              <button type="button" onClick={() => handleDelete(country.slug)} className={BTN_DELETE}>
                Sil
              </button>
            </div>
          </li>
        ))}
        {countries.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Heç bir ölkə yoxdur</li>
        )}
      </ul>
    </section>
  );
}
