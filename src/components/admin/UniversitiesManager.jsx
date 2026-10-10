import { useEffect, useState } from 'react';
import ImageUploadField from './ImageUploadField';
import { addUniversity, deleteUniversity, getUniversitiesByCountry, getUniversityEntity, updateUniversity } from '../../services/contentApi';
import { describeFailure } from '../../services/httpClient';
import { endAdminSession, hasAdminToken, isAuthFailure } from '../../services/session';
import { useAllCountries } from '../../services/contentHooks';
import { resolveImageFile } from '../../utils/imageFile';
import { UNIVERSITY_TYPES } from '../../utils/format';
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

// AddUniversityRequestDTO və UpdateUniversityRequestDTO bu mətn sahələrini
// required (minLength 1) işarələyir.
const REQUIRED_LABELS = {
  universityName: 'Universitet adı',
  shortDescription: 'Qısa təsvir',
  city: 'Şəhər',
  content: 'Content (uzun mətn)',
  area: 'Area',
};

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
  fee: '',
};

export default function UniversitiesManager() {
  const { data, loading: loadingCountries } = useAllCountries();
  const countries = data || [];

  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingCountry, setEditingCountry] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [rawResponse, setRawResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(editingName);

const activeCountry = selectedCountry || countries[0]?.name || '';

  // PATCH /university/update universiteti (universityName + countryName) ilə
  // tanıyır. Redaktə zamanı hədəf seçilmiş qeyddir, ona görə hər ikisi
  // kilidlənir və göndərilən dəyərlər formadan deyil, bu sabitlərdən gəlir.
  const targetUniversityName = isEditing ? editingName : form.universityName.trim();
  const targetCountryName = isEditing ? editingCountry : (form.countryName || activeCountry);

  useEffect(() => {
    if (!activeCountry) {
      setUniversities([]);
      return undefined;
    }

    let active = true;
    setLoadingList(true);

    getUniversitiesByCountry(activeCountry)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setUniversities(
          list
            .map((entry) => (typeof entry === 'string' ? entry : entry?.university_name))
            .filter(Boolean)
            .map((name) => ({ id: name, universityName: name, countryName: activeCountry })),
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
    setEditingName('');
    setEditingCountry('');
    setForm(EMPTY_FORM);
    setStatus({ state: 'idle', message: '' });
    setRawResponse('');
  };

  const handleEdit = async (university) => {
    const lockedCountry = university.countryName || activeCountry;

    setStatus({ state: 'loading', message: `${university.universityName} yüklənir...` });
    setEditingName(university.universityName);
    setEditingCountry(lockedCountry);
    setShowForm(true);

    let detail = null;
    let loadNote = '';
    try {
      detail = await getUniversityEntity(university.universityName);
      if (!detail) loadNote = 'Server boş cavab qaytardı';
    } catch (err) {
      loadNote = describeFailure(err, 'Məlumat yüklənmədi');
    }

    setForm({
      universityName: detail?.universityName || university.universityName,
      // Redaktə zamanı ölkə kilidlənir, ona görə server cavabından deyil,
      // seçilmiş qeydin ölkəsi göstərilir.
      countryName: lockedCountry,
      universityType: detail?.universityType || 'PUBLIC',
      shortDescription: detail?.shortDescription || '',
      universityLogo: detail?.universityLogo || '',
      fee: String(detail?.fee ?? ''),
      city: detail?.city || '',
      content: detail?.content || '',
      area: detail?.area || '',
      isPartner: Boolean(detail?.isPartner),
    });
    setStatus({
      state: loadNote ? 'error' : 'idle',
      message: loadNote ? `Redaktə məlumatı: ${loadNote}` : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasAdminToken()) {
      setStatus({
        state: 'error',
        message:
          'Admin tokeni brauzerdə yoxdur, ona görə sorğu göndərilmədi. ' +
          'Əvvəlcə /admin/login səhifəsindən daxil olun.',
      });
      return;
    }

    const countryName = targetCountryName;
    if (!targetUniversityName || !countryName) return;

    setIsSaving(true);
    setStatus({ state: 'loading', message: '' });
    setRawResponse('');

    try {
      const missing = Object.entries(REQUIRED_LABELS)
        .filter(([key]) => !String(form[key] || '').trim())
        .map(([, label]) => label);

      if (missing.length > 0) {
        setStatus({ state: 'error', message: `Bu sahələr doldurulmalıdır: ${missing.join(', ')}.` });
        setIsSaving(false);
        return;
      }

      const { file: logo, reason: logoReason } = await resolveImageFile(
        form.universityLogo,
        'logo',
      );
      // Yeni universitet üçün loqo məcburidir; redaktədə isə backend
      // UpdateUniversityRequestDTO-da onu məcburi saymır, ona görə loqo
      // seçilməyibsə omis edilir və mövcud dəyər serverdə saxlanılır.
      if (!isEditing && !logo) {
        setStatus({
          state: 'error',
          message:
            logoReason === 'fetch-blocked'
              ? 'Universitet loqosu serverdən yüklənə bilmədi (CORS). Loqonu əl ilə seçməlisiniz.'
              : 'Universitet loqosu faylı məcburidir.',
        });
        setIsSaving(false);
        return;
      }

      const payload = {
        universityName: targetUniversityName,
        countryName,
        universityType: form.universityType,
        shortDescription: form.shortDescription.trim(),
        universityLogo: logo,
        fee: Number(form.fee) || 0,
        city: form.city.trim(),
        content: form.content.trim(),
        area: form.area.trim(),
        isPartner: form.isPartner,
      };

      const result = isEditing
        ? await updateUniversity(payload)
        : await addUniversity(payload);

      // The backend may answer 200 with an empty body, so the list is refetched
      // and the outcome verified instead of trusting the response.
      const fresh = await getUniversitiesByCountry(countryName).catch(() => null);
      const saved = Array.isArray(fresh)
        && fresh.some((entry) =>
          (typeof entry === 'string' ? entry : entry?.university_name)
            === targetUniversityName,
        );

      setSelectedCountry(countryName);
      closeForm();

      if (saved) {
        setUniversities(
          (fresh || []).map((entry) => {
            const name = typeof entry === 'string' ? entry : entry?.university_name;
            return { id: name, universityName: name, countryName };
          }),
        );
        setStatus({
          state: 'success',
          message: `"${targetUniversityName}" ${isEditing ? 'yeniləndi' : 'əlavə edildi'} və siyahı yeniləndi.`,
        });
        return;
      }

      setStatus({
        state: 'error',
        message:
          result === null || result === undefined
            ? 'Server boş cavab qaytardı və universitet siyahıda da görünmür. Server loglarına baxın.'
            : `${isEditing ? 'Yenilənmədi' : 'Universitet əlavə edilmədi'} və siyahıda da görünmür. Server cavabı: ${JSON.stringify(result)}`,
      });
    } catch (err) {
      const tokenPreview = (() => {
        try {
          const t = localStorage.getItem('eduSoliton_admin_token') || '';
          return t ? `${t.slice(0, 12)}… (${t.length} simvol)` : 'YOXDUR';
        } catch {
          return 'oxunmadı';
        }
      })();
      setRawResponse(
        [`Endpoint: PATCH /university/update`, `Status: ${err?.status ?? '?'}`, `Token: ${tokenPreview}`, `Cavab body: ${err?.body ? JSON.stringify(err.body) : 'yoxdur (boş)'}`].join('\n'),
      );
      if (isAuthFailure(err)) {
        endAdminSession();
      } else {
        setStatus({ state: 'error', message: describeFailure(err, 'Naməlum xəta') });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (universityName) => {
    if (!window.confirm(`"${universityName}" universiteti silinsin?`)) return;

    try {
      await deleteUniversity({ universityName });
      const fresh = await getUniversitiesByCountry(activeCountry).catch(() => null);

      if (Array.isArray(fresh)) {
        setUniversities(
          fresh.map((entry) => {
            const name = typeof entry === 'string' ? entry : entry?.university_name;
            return { id: name, universityName: name, countryName: activeCountry };
          }),
        );
      } else {
        setUniversities((prev) => prev.filter((u) => u.universityName !== universityName));
      }

      setStatus({
        state: 'success',
        message: `"${universityName}" silindi və siyahı yeniləndi.`,
      });
    } catch (err) {
      setStatus({ state: 'error', message: describeFailure(err, 'Universitet silinmədi.') });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>
          Universitetlər
          {isEditing && (
            <span className="ml-2 align-middle text-[12px] font-accent font-medium text-[#26aec4]">
              Redaktə: {targetUniversityName}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={() => (showForm || isEditing ? closeForm() : setShowForm(true))}
          className={BTN_ACCENT}
        >
          {showForm || isEditing ? 'İmtina' : 'Əlavə et'}
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
              className={`${FIELD_INPUT} ${
                isEditing ? 'bg-[#ececec] text-[#323643]/55 cursor-not-allowed' : ''
              }`}
              readOnly={isEditing}
              tabIndex={isEditing ? -1 : undefined}
              aria-readonly={isEditing || undefined}
              title={isEditing ? 'Redaktə zamanı universitet adı dəyişdirilə bilməz' : undefined}
              required
            />
            {isEditing && (
              <p className="mt-1 text-[10px] text-[#323643]/50">
                Ad dəyişdirilə bilməz — endpoint universiteti adı ilə tanıyır.
              </p>
            )}
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="uni-country-select">Ölkə adı *</label>
            <select
              id="uni-country-select"
              name="countryName"
              value={form.countryName || activeCountry}
              onChange={handleChange}
              className={`${FIELD_INPUT} ${
                isEditing ? 'bg-[#ececec] text-[#323643]/55 cursor-not-allowed' : ''
              }`}
              disabled={isEditing}
              aria-readonly={isEditing || undefined}
              title={isEditing ? 'Redaktə zamanı ölkə dəyişdirilə bilməz' : undefined}
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

          <div className="sm:col-span-2 sm:col-start-1">
            <label className={FIELD_LABEL} htmlFor="uni-fee">University Fee ($)</label>
            <input
              id="uni-fee"
              name="fee"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.fee}
              onChange={handleChange}
              placeholder="0 = pulsuz"
              className={FIELD_INPUT}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label={`Universitet loqosu (fayl)${isEditing ? '' : ' *'}`}
              value={form.universityLogo}
              onChange={(value) => setForm((prev) => ({ ...prev, universityLogo: value }))}
              maxSize={320}
              hint={
                isEditing
                  ? 'İsteğe bağlıdır — boş qalsa mövcud loqo saxlanılır'
                  : 'JPG/PNG, avtomatik 320px-ə kiçildilir'
              }
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
            <p
              role={status.state === 'error' ? 'alert' : 'status'}
              className={`sm:col-span-2 text-[12px] ${
                status.state === 'error' ? 'text-red-600' : 'text-[#1a8a99]'
              }`}
            >
              {status.message}
            </p>
          )}

          {rawResponse && (
            <div className="sm:col-span-2">
              <pre className="bg-[#0b1140] text-[#8ef6e4] text-[11px] rounded p-3 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                {rawResponse}
              </pre>
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2 flex-wrap">
            <button type="button" onClick={closeForm} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" disabled={isSaving} className={BTN_PRIMARY}>
              {isSaving ? 'Göndərilir...' : isEditing ? 'Yenilə' : 'Əlavə et'}
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
                  {activeCountry}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(university)}
                  className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition"
                >
                  Redaktə
                </button>
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
