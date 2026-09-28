import { useEffect, useState } from 'react';
import ImageUploadField from './ImageUploadField';
import { addUniversity, deleteUniversity, getCountry } from '../../services/contentApi';
import { useTopCountries } from '../../services/contentHooks';
import { mapTopCountry } from '../../services/mappers';
import { dataUrlToFile } from '../../utils/imageFile';
import { UNIVERSITY_TYPES, getUniversityTypeLabel } from '../../utils/format';
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
  countryName: '',
  universityType: 'PUBLIC',
  shortDescription: '',
  universityLogo: '',
  city: '',
  content: '',
  area: '',
  isPartner: false,
};

export default function UniversitiesManager() {
  const { data, loading: loadingCountries } = useTopCountries();
  const countries = (data || []).map(mapTopCountry).filter(Boolean);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  const activeCountry = selectedCountry || countries[0]?.name || '';

  useEffect(() => {
    if (!activeCountry) {
      setUniversities([]);
      return undefined;
    }

    let active = true;
    setLoadingList(true);

    getCountry(activeCountry)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data?.universities) ? data.universities : [];
        setUniversities(
          list
            .map((entry) => (typeof entry === 'string' ? entry : entry?.name))
            .filter(Boolean)
            .map((name) => ({ id: name, universityName: name })),
        );
      })
      .catch(() => {
        if (active) setUniversities([]);
      })
      .finally(() => {
        if (active) setLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, [activeCountry]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setStatus({ state: 'idle', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const countryName = form.countryName || activeCountry;
    if (!form.universityName.trim() || !countryName) return;

    setIsSaving(true);
    setStatus({ state: 'loading', message: '' });

    try {
      const logo = await dataUrlToFile(form.universityLogo, 'logo');
      if (!logo) {
        setStatus({ state: 'error', message: 'Universitet loqosu faylı məcburidir.' });
        setIsSaving(false);
        return;
      }

      const result = await addUniversity({
        universityName: form.universityName.trim(),
        countryName,
        universityType: form.universityType,
        shortDescription: form.shortDescription.trim(),
        universityLogo: logo,
        city: form.city.trim(),
        content: form.content.trim(),
        area: form.area.trim(),
        isPartner: form.isPartner,
      });

      if (result?.is_created) {
        setSelectedCountry(countryName);
        closeForm();
        setUniversities((prev) =>
          prev.some((u) => u.universityName === form.universityName.trim())
            ? prev
            : [...prev, { id: form.universityName.trim(), universityName: form.universityName.trim() }],
        );
      } else {
        setStatus({
          state: 'error',
          message: (result?.errors || [])[0]?.message || 'Universitet əlavə edilmədi.',
        });
      }
    } catch (err) {
      setStatus({ state: 'error', message: err?.message || 'Xəta baş verdi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (universityName) => {
    if (!window.confirm(`"${universityName}" universiteti silinsin?`)) return;

    try {
      const result = await deleteUniversity({ universityName });
      if (result?.is_deleted) {
        setUniversities((prev) => prev.filter((u) => u.universityName !== universityName));
      } else {
        window.alert('Universitet silinmədi.');
      }
    } catch (err) {
      window.alert(err?.message || 'Universitet silinmədi.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>Universitetlər</h2>
        <button type="button" onClick={() => (showForm ? closeForm() : setShowForm(true))} className={BTN_ACCENT}>
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      <div>
        <label className={FIELD_LABEL} htmlFor="uni-country">Ölkə seçin</label>
        <select
          id="uni-country"
          value={activeCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setUniversities([]);
          }}
          className={FIELD_INPUT}
          disabled={loadingCountries}
        >
          {countries.length === 0 && <option value="">Ölkə yoxdur</option>}
          {countries.map((c) => (
            <option key={c.slug} value={c.name}>{c.name}</option>
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
              name="countryName"
              value={form.countryName || activeCountry}
              onChange={handleChange}
              className={FIELD_INPUT}
              required
            >
              <option value="" disabled>Ölkə seçin</option>
              {countries.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
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
              label="Universitet loqosu (fayl) *"
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

          {status.message && (
            <p role="alert" className="sm:col-span-2 text-[12px] text-red-600">
              {status.message}
            </p>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={closeForm} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" disabled={isSaving} className={BTN_PRIMARY}>
              {isSaving ? 'Göndərilir...' : 'Əlavə et'}
            </button>
          </div>
        </form>
      )}

      {loadingList ? (
        <p className="text-center py-8 text-[#323643]/50 text-[13px]">Yüklənir...</p>
      ) : (
        <ul className="space-y-2" role="list">
          {universities.map((university) => (
            <li key={university.id} className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[#080d4a] text-[14px] font-medium block truncate">
                  {university.universityName}
                </span>
                <span className="text-[#323643]/50 text-[11px]">
                  {activeCountry} · {getUniversityTypeLabel('PUBLIC')}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDelete(university.universityName)}
                  className={BTN_DELETE}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
          {universities.length === 0 && (
            <li className="text-center py-8 text-[#323643]/50 text-[13px]">
              {activeCountry ? `${activeCountry} üçün universitet yoxdur` : 'Bu ölkədə universitet yoxdur'}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
