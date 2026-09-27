import { useState, useSyncExternalStore } from 'react';
import ImageUploadField from './ImageUploadField';
import {
  addUniversity,
  getCountries,
  getUniversities,
  removeUniversity,
  subscribe,
  updateUniversity,
} from '../../store/adminStore';
import {
  UNIVERSITY_TYPES,
  getUniversityName,
  getUniversityTypeLabel,
  universityInitials,
} from '../../utils/format';
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
  universityName: '',
  countrySlug: '',
  universityType: 'PUBLIC',
  shortDescription: '',
  universityLogo: '',
  city: '',
  content: '',
  area: '',
  isPartner: false,
  universityFee: '',
  semesterCount: '6',
};

function UniversityLogo({ university }) {
  const name = getUniversityName(university);

  if (university.universityLogo) {
    return (
      <img
        src={university.universityLogo}
        alt=""
        className="w-11 h-11 object-contain rounded bg-[#f6eeee] shrink-0"
      />
    );
  }

  return (
    <span className="w-11 h-11 rounded bg-[#080d4a] text-white flex items-center justify-center font-heading font-bold text-[13px] shrink-0">
      {universityInitials(name) || 'U'}
    </span>
  );
}

export default function UniversitiesManager() {
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(countries[0]?.slug || '');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const universities = selectedSlug ? getUniversities(selectedSlug) : [];
  const selectedCountry = countries.find((c) => c.slug === selectedSlug);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const countrySlug = form.countrySlug || selectedSlug;
    if (!form.universityName.trim() || !countrySlug) return;

    const saved = editingId
      ? updateUniversity(countrySlug, editingId, form)
      : addUniversity(countrySlug, form);

    if (!saved) {
      window.alert('Yadda saxlamaq mümkün olmadı — brauzer yaddaş limiti dolub.');
      return;
    }

    setSelectedSlug(countrySlug);
    setForm({ ...EMPTY_FORM, countrySlug });
    setEditingId('');
    setShowForm(false);
  };

  const handleEdit = (university) => {
    setForm({
      universityName: university.universityName,
      countrySlug: selectedSlug,
      universityType: university.universityType,
      shortDescription: university.shortDescription,
      universityLogo: university.universityLogo,
      city: university.city,
      content: university.content,
      area: university.area,
      isPartner: university.isPartner,
      universityFee: String(university.universityFee || ''),
      semesterCount: String(university.semesterCount || ''),
    });
    setEditingId(university.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Universiteti silmək istəyirsiz?')) {
      removeUniversity(selectedSlug, id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>Universitetlər</h2>
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setEditingId('');
            setForm({ ...EMPTY_FORM, countrySlug: selectedSlug });
          }}
          className={BTN_ACCENT}
        >
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      <div>
        <label className={FIELD_LABEL} htmlFor="uni-country">Ölkə seçin</label>
        <select
          id="uni-country"
          value={selectedSlug}
          onChange={(e) => {
            setSelectedSlug(e.target.value);
            setEditingId('');
          }}
          className={FIELD_INPUT}
        >
          <option value="" disabled>Ölkə seçin</option>
          {countries.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div>
            <label className={FIELD_LABEL} htmlFor="uni-name">Universitet adı *</label>
            <input
              id="uni-name"
              name="universityName"
              value={form.universityName}
              onChange={handleChange}
              placeholder="Məsələn: Berlin Technical University"
              className={FIELD_INPUT}
              required
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-country-select">Ölkə adı *</label>
            <select
              id="uni-country-select"
              name="countrySlug"
              value={form.countrySlug || selectedSlug}
              onChange={handleChange}
              className={FIELD_INPUT}
              disabled={Boolean(editingId)}
              title={editingId ? 'Redaktə zamanı ölkə dəyişmək mümkün deyil' : undefined}
              required
            >
              <option value="" disabled>Ölkə seçin</option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-type">Universitet növü *</label>
            <select
              id="uni-type"
              name="universityType"
              value={form.universityType}
              onChange={handleChange}
              className={FIELD_INPUT}
            >
              {UNIVERSITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-city">Şəhər</label>
            <input
              id="uni-city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Məsələn: Berlin"
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-fee">University Fee</label>
            <div className="relative">
              <input
                id="uni-fee"
                name="universityFee"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.universityFee}
                onChange={handleChange}
                placeholder="0 = pulsuz"
                className={`${FIELD_INPUT} pr-[46px]`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#323643]/50">$</span>
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-semester">Semester Count</label>
            <input
              id="uni-semester"
              name="semesterCount"
              type="number"
              min="1"
              max="12"
              step="1"
              inputMode="numeric"
              value={form.semesterCount}
              onChange={handleChange}
              className={FIELD_INPUT}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="uni-short">Qısa təsvir</label>
            <input
              id="uni-short"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Bir cümləlik izahat"
              className={FIELD_INPUT}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Universitet loqosu (fayl)"
              value={form.universityLogo}
              onChange={(value) => setForm((prev) => ({ ...prev, universityLogo: value }))}
              maxSize={320}
              hint="JPG/PNG, avtomatik 320px-ə kiçildilir"
              previewClass="w-full h-[110px] object-contain"
              previewWrapper="w-[160px] h-[110px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="uni-content">Content (uzun mətn)</label>
            <textarea id="uni-content" name="content" value={form.content} onChange={handleChange} rows={5} className={FIELD_TEXTAREA} />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="uni-area">Area</label>
            <textarea id="uni-area" name="area" value={form.area} onChange={handleChange} rows={2} className={FIELD_TEXTAREA} />
          </div>

          <div className="sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-[13px] text-[#323643] cursor-pointer">
              <input
                type="checkbox"
                name="isPartner"
                checked={form.isPartner}
                onChange={handleChange}
                className="w-4 h-4 accent-[#26aec4]"
              />
              Partner universitet (Partner badge)
            </label>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId('');
              }}
              className="px-4 py-1.5 text-[12px]"
            >
              Ləğv et
            </button>
            <button type="submit" className={BTN_PRIMARY}>
              {editingId ? 'Yadda saxla' : 'Əlavə et'}
            </button>
          </div>
        </form>
      )}

      {selectedSlug ? (
        <ul className="space-y-2" role="list">
          {universities.map((university) => (
            <li key={university.id} className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <UniversityLogo university={university} />
                <div className="min-w-0">
                  <span className="text-[#080d4a] text-[14px] font-medium block truncate">
                    {getUniversityName(university)}
                  </span>
                  <span className="text-[#323643]/50 text-[11px]">
                    {getUniversityTypeLabel(university.universityType)}
                    {university.city && ` · ${university.city}`}
                    {` · ${university.universityFee > 0 ? `${university.universityFee}$` : 'Free'}`}
                    {` · ${university.semesterCount || 0} semestr`}
                    {university.isPartner && ' · Partner'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(university)}
                  className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition"
                >
                  Redaktə
                </button>
                <button type="button" onClick={() => handleDelete(university.id)} className={BTN_DELETE}>
                  Sil
                </button>
              </div>
            </li>
          ))}
          {universities.length === 0 && (
            <li className="text-center py-8 text-[#323643]/50 text-[13px]">
              {selectedCountry ? `${selectedCountry.name} üçün universitet yoxdur` : 'Bu ölkədə universitet yoxdur'}
            </li>
          )}
        </ul>
      ) : (
        <p className="text-center py-8 text-[#323643]/50 text-[13px]">
          Universitet əlavə etmək üçün ölkə seçin
        </p>
      )}
    </section>
  );
}
