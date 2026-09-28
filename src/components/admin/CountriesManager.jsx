import { useState } from 'react';
import ImageUploadField from './ImageUploadField';
import { addCountry, deleteCountry } from '../../services/contentApi';
import { useTopCountries, useCountryDetails } from '../../services/contentHooks';
import { ADMIN_TOKEN_KEY } from '../../config/api';
import { readToken } from '../../services/httpClient';
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
  features: [],
  heroImage: '',
  description: '',
  areasText: '',
  icon: '',
};

export default function CountriesManager() {
  const { data, loading, error, reload } = useTopCountries();
  const countries = (data || []).map(mapTopCountry).filter(Boolean);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [detailName, setDetailName] = useState('');
  const hasAdminToken = Boolean(readToken(ADMIN_TOKEN_KEY));

  const { data: detail, loading: loadingDetail, error: detailError } = useCountryDetails(
    detailName,
    { enabled: hasAdminToken },
  );

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
    setForm(EMPTY_FORM);
    setStatus({ state: 'idle', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSaving(true);
    setStatus({ state: 'loading', message: '' });

    try {
      const [flagImage, countryImage] = await Promise.all([
        dataUrlToFile(form.flag, 'flag'),
        dataUrlToFile(form.heroImage, 'country'),
      ]);

      if (!flagImage || !countryImage) {
        setStatus({
          state: 'error',
          message: 'Bayraq və hero şəkil faylları məcburidir.',
        });
        setIsSaving(false);
        return;
      }

      const result = await addCountry({
        countryName: form.name.trim(),
        flagImage,
        countryImage,
        universityCount: Number(form.universityCount) || 0,
        tuitionFee: Number(form.tuitionFee) || 0,
        rentalFee: Number(form.rentalFee) || 0,
        isVisaHelp: form.features.includes('Visa Help'),
        isDormitoryHelp: form.features.includes('Dormitories'),
        isTopList: true,
        content: form.description.trim(),
        area: form.areasText.trim(),
        icon: form.icon.trim() || form.name.trim(),
      });

      if (result?.is_country_created) {
        closeForm();
        reload();
      } else {
        setStatus({
          state: 'error',
          message: (result?.errors || [])[0]?.message || 'Ölkə əlavə edilmədi.',
        });
      }
    } catch (err) {
      setStatus({ state: 'error', message: err?.message || 'Xəta baş verdi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (country) => {
    if (!window.confirm(`"${country.name}" silinsin?`)) return;

    try {
      const result = await deleteCountry({ countryName: country.name });
      if (result?.is_deleted) reload();
    } catch (err) {
      window.alert(err?.message || 'Silmək mümkün olmadı.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>Ölkələr</h2>
        <button type="button" onClick={() => (showForm ? closeForm() : setShowForm(true))} className={BTN_ACCENT}>
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-[12px]">
          {error.message}
        </p>
      )}

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
              {isSaving ? 'Göndərilir...' : 'Yadda saxla'}
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
                onClick={() => setDetailName((prev) => (prev === country.name ? '' : country.name))}
                className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition"
              >
                {detailName === country.name ? 'Bağla' : 'Detallar'}
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

      {detailName && (
        <div className={`${CARD} space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[#080d4a] text-[15px] font-semibold">
              Detallar: {detailName}
            </h3>
            <code className="text-[10px] text-[#323643]/50 break-all">
              GET /country/country_details/{detailName}
            </code>
          </div>

          {loadingDetail && (
            <p className="text-[#323643]/50 text-[12px]">Yüklənir...</p>
          )}

          {!hasAdminToken && (
            <p className="text-[#323643]/60 text-[12px] leading-5">
              Admin tokeni tapılmadı. Bu endpoint üçün giriş tələb olunur —{' '}
              <button
                type="button"
                onClick={() => window.location.assign('/admin/login')}
                className="text-[#26aec4] hover:underline"
              >
                yenidən daxil olun
              </button>
              .
            </p>
          )}

          {hasAdminToken && detailError && (
            <p role="alert" className="text-red-600 text-[12px]">
              {detailError.message}
            </p>
          )}

          {hasAdminToken && !loadingDetail && !detailError && !detail && (
            <p className="text-[#323643]/60 text-[12px] leading-5">
              Endpoint boş cavab qaytardı (200, boş body). Swagger-da da bu endpoint
              yoxdur — backend tərəfdə tamamlanmayan endpoint kimi görünür.
            </p>
          )}

          {detail && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
              {Object.entries(detail).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <dt className="text-[#323643]/60 shrink-0">{key}:</dt>
                  <dd className="text-[#080d4a] break-all">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </section>
  );
}
