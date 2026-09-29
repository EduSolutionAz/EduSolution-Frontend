import { useState } from 'react';
import ImageUploadField from './ImageUploadField';
import { addCountry, deleteCountry, getCountry, getTopCountries, updateCountry } from '../../services/contentApi';
import { describeFailure } from '../../services/httpClient';
import { useTopCountries } from '../../services/contentHooks';
import { mapTopCountry } from '../../services/mappers';
import { dataUrlToFile } from '../../utils/imageFile';
import { FEATURE_OPTIONS, formatUniversityCount, formatUsd } from '../../utils/format';
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
  universityCount: '',
  tuitionFee: '',
  rentalFee: '',
  // Checked by default: the admin list reads /country/top_countries, so a
  // country saved without this flag is invisible and cannot be edited.
  features: ['isTopList'],
  heroImage: '',
  description: '',
  areasText: '',
  icon: '',
};

export default function CountriesManager() {
  const { data, loading, error, reload } = useTopCountries();
  const countries = (data || []).map(mapTopCountry).filter(Boolean);

  const [showForm, setShowForm] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(editingName);

// CountryAddRequestDTO and UpdateCountryRequestDTO mark these as required
// with minLength 1, so an empty value makes the backend reject the request.
const REQUIRED_LABELS = {
  name: 'Ölkə adı',
  icon: 'İkon (mətn)',
  description: 'Təsvir',
  areasText: 'Ərazilər mətni',
};

function missingRequiredFields(form) {
  return Object.entries(REQUIRED_LABELS)
    .filter(([key]) => !String(form[key] || '').trim())
    .map(([, label]) => label);
}

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
    setEditingName('');
    setForm(EMPTY_FORM);
    setStatus({ state: 'idle', message: '' });
  };

  const handleEdit = async (country) => {
    setStatus({ state: 'loading', message: `${country.name} yüklənir...` });
    setEditingName(country.name);
    setShowForm(true);

    let detail = null;
    let loadNote = '';

    // /country/country_entity is documented as GET with a requestBody, which no
    // HTTP client can send, so it answers 500. The public detail endpoint
    // carries the same text fields, so it is used instead.
    try {
      const { data } = await getCountry(country.name);
      detail = data || null;
      if (!detail) {
        loadNote = 'Server boş cavab qaytardı';
      }
    } catch (err) {
      loadNote = describeFailure(err, 'Məlumat yüklənmədi');
    }

    setForm({
      name: detail?.title || country.name,
      flag: '',
      heroImage: detail?.photo_url || country.heroImage || '',
      universityCount: String(country.card.universityCount ?? ''),
      tuitionFee: String(country.card.tuitionFee ?? ''),
      rentalFee: '',
      features: [
        'isTopList',
        ...(country.card.features.includes('Visa Help') ? ['isVisaHelp'] : []),
        ...(country.card.features.includes('Dormitories') ? ['isDormitoryHelp'] : []),
      ],
      description: detail?.content || '',
      areasText: detail?.areas || '',
      icon: country.name,
    });
    setStatus({
      state: 'error',
      message: loadNote
        ? `Redaktə məlumatı: ${loadNote}`
        : 'Qiymət və bayraq serverdən gəlmir (country_entity endpoint-i səhv dizayn edilib) — əllə doldurmalı olacaq.',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const missing = missingRequiredFields(form);
    if (missing.length > 0) {
      setStatus({
        state: 'error',
        message: `Bu sahələr doldurulmalıdır: ${missing.join(', ')}.`,
      });
      return;
    }

    setIsSaving(true);
    setStatus({ state: 'loading', message: '' });

    try {
      const [flagImage, countryImage] = await Promise.all([
        dataUrlToFile(form.flag, 'flag'),
        dataUrlToFile(form.heroImage, 'country'),
      ]);

      if (!flagImage || !countryImage) {
        // The entity endpoint returns image URLs, which cannot be re-uploaded
        // as files, so editing requires picking both images again.
        setStatus({
          state: 'error',
          message: isEditing
            ? 'Redaktə zamanı bayraq və hero şəkli yenidən seçilməlidir — server məlumatı URL qaytarır, fayl deyil.'
            : 'Bayraq və hero şəkil faylları məcburidir.',
        });
        setIsSaving(false);
        return;
      }

      const result = isEditing
        ? await updateCountry({
            countryName: form.name.trim(),
            flagImage,
            countryImage,
            universityCount: Number(form.universityCount) || 0,
            tuitionFee: Number(form.tuitionFee) || 0,
            rentalFee: Number(form.rentalFee) || 0,
            isVisaHelp: form.features.includes('isVisaHelp'),
            isDormitoryHelp: form.features.includes('isDormitoryHelp'),
            isTopList: form.features.includes('isTopList'),
            content: form.description.trim(),
            area: form.areasText.trim(),
            icon: form.icon.trim() || form.name.trim(),
          })
        : await addCountry({
            countryName: form.name.trim(),
            flagImage,
            countryImage,
            universityCount: Number(form.universityCount) || 0,
            tuitionFee: Number(form.tuitionFee) || 0,
            rentalFee: Number(form.rentalFee) || 0,
            isVisaHelp: form.features.includes('isVisaHelp'),
            isDormitoryHelp: form.features.includes('isDormitoryHelp'),
            isTopList: form.features.includes('isTopList'),
            content: form.description.trim(),
            area: form.areasText.trim(),
            icon: form.icon.trim() || form.name.trim(),
          });

      // The backend creates the record but answers 200 with an empty body, so
      // the response cannot be trusted. The list is refetched and the outcome
      // is verified against it instead.
      const fresh = await getTopCountries().catch(() => null);
      reload();

      const saved = (fresh || [])
        .map((entry) => entry?.country_name)
        .includes(form.name.trim());

      closeForm();

      if (saved) {
        setStatus({
          state: 'success',
          message: `"${form.name.trim()}" ${isEditing ? 'yeniləndi' : 'əlavə edildi'} və siyahı yeniləndi.`,
        });
        return;
      }

      setStatus({
        state: 'error',
        message:
          result === null || result === undefined
            ? 'Server boş cavab qaytardı və ölkə siyahıda da görünmür. Server loglarına baxın — /country/add_country daxilində xəta ola bilər.'
            : `${isEditing ? 'Yenilənmədi' : 'Ölkə əlavə edilmədi'} və siyahıda da görünmür. Server cavabı: ${JSON.stringify(result)}`,
      });
    } catch (err) {
      setStatus({ state: 'error', message: describeFailure(err, 'Naməlum xəta') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (country) => {
    if (!window.confirm(`"${country.name}" silinsin?`)) return;

    try {
      // Always refetch: the delete response can be an empty 200 as well.
      await deleteCountry({ countryName: country.name });
      const fresh = await getTopCountries().catch(() => null);
      reload();

      const stillThere = (fresh || []).some((entry) => entry?.country_name === country.name);
      setStatus({
        state: stillThere ? 'error' : 'success',
        message: stillThere
          ? `"${country.name}" hələ də siyahıdadır — silinmədi.`
          : `"${country.name}" silindi.`,
      });
    } catch (err) {
      window.alert(err?.message || 'Silmək mümkün olmadı.');
    }
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
        <button
          type="button"
          onClick={() => (showForm || isEditing ? closeForm() : setShowForm(true))}
          className={BTN_ACCENT}
        >
          {showForm || isEditing ? 'İmtina' : 'Əlavə et'}
        </button>      </div>

      {error && (
        <p role="alert" className="text-red-600 text-[12px]">
          {error.message}
        </p>
      )}

      <p className="text-[#323643]/50 text-[11px] -mt-3">
        Bu siyahı <code className="text-[#323643]/70">GET /country/top_countries</code> endpoint-indən
        gəlir, yəni yalnız <strong>Top List</strong> işarəli ölkələr görünür. Top List olmayan
        ölkələri idarə etmək mümkün deyil — backend-də bütün ölkələri qaytaran endpoint yoxdur.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div>
            <label className={FIELD_LABEL} htmlFor="country-name">Ölkə adı *</label>
            <input id="country-name" name="name" value={form.name} onChange={handleChange} required className={FIELD_INPUT} />
          </div>

          <div>
            <ImageUploadField
              label="Bayraq (fayl) *"
              value={form.flag}
              onChange={(value) => setForm((prev) => ({ ...prev, flag: value }))}
              maxSize={96}
              hint="JPG/PNG, avtomatik 96px-ə kiçildilir"
              previewClass="w-full h-[70px] object-contain"
              previewWrapper="w-[110px] h-[70px]"
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-count">Universitet sayı</label>
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
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-fee">Təlim ücreti ($)</label>
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
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-rental">İçarə haqqı ($)</label>
            <input
              id="country-rental"
              name="rentalFee"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.rentalFee}
              onChange={handleChange}
              placeholder="0"
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="country-icon">İkon (mətn)</label>
            <input
              id="country-icon"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="avtomatik: ölkə adı"
              className={FIELD_INPUT}
            />
          </div>

          <fieldset className="sm:col-span-2">
            <legend className={FIELD_LABEL}>Xüsusiyyətlər</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {FEATURE_OPTIONS.map((option) => (
                <label key={option.value} className="inline-flex items-center gap-2 text-[13px] text-[#323643] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.features.includes(option.value)}
                    onChange={() => toggleFeature(option.value)}
                    className="w-4 h-4 accent-[#26aec4]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Hero şəkil (fayl) *"
              value={form.heroImage}
              onChange={(value) => setForm((prev) => ({ ...prev, heroImage: value }))}
              maxSize={1400}
              hint="JPG/PNG, avtomatik 1400px-ə kiçildilir"
              previewClass="w-full h-[120px] object-cover"
              previewWrapper="w-full h-[120px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-desc">Təsvir</label>
            <textarea id="country-desc" name="description" value={form.description} onChange={handleChange} rows={3} className={FIELD_TEXTAREA} />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="country-areas">Ərazilər mətni</label>
            <textarea id="country-areas" name="areasText" value={form.areasText} onChange={handleChange} rows={2} className={FIELD_TEXTAREA} />
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
              {isSaving ? 'Göndərilir...' : isEditing ? 'Yenilə' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-center py-8 text-[#323643]/50 text-[13px]">Yüklənir...</p>}

      <ul className="space-y-2" role="list">
        {countries.map((country) => (
          <li key={country.slug} className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <span className="text-[#080d4a] font-semibold text-[14px] block truncate">
                  {country.name}
                </span>
                <span className="text-[#323643]/50 text-[11px]">
                  {formatUniversityCount(country.card.universityCount) || 'universitet sayı yoxdur'}
                  {' · '}
                  {formatUsd(country.card.tuitionFee)}
                  {country.card.features.length > 0 && ` · ${country.card.features.join(', ')}`}
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
              <button
                type="button"
                onClick={() => handleDelete(country)}
                className={BTN_DELETE}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
        {!loading && countries.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Heç bir ölkə yoxdur</li>
        )}
      </ul>
    </section>
  );
}
