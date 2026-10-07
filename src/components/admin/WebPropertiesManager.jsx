import { useEffect, useState } from 'react';
import { addWebProperties, getWebProperties } from '../../services/propertyApi';
import { describeFailure } from '../../services/httpClient';
import {
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from './fields';

// AddWebPropertiesRequestDTO yalnız bu 5 sahəni qəbul edir.
// visa_success_rate DTO-da YOXDUR: backend onu visa_help və
// successful_visa_help dəyərlərindən hesablayıb qaytarır, ona görə
// yalnız oxuna bilən (read-only) göstərilir.
const FIELDS = [
  { key: 'students_helped', label: 'Students Helped', hint: 'Ümumi kömək etdiyimiz tələbə sayı' },
  { key: 'visa_success_rate', label: 'Visa Success Rate', hint: 'Backend hesablayır — dəyişmək mümkün deyil', readOnly: true },
  { key: 'admissions_sent', label: 'Admission Sent', hint: 'Göndərdiyimiz qəbul müraciətləri' },
  { key: 'successful_admission', label: 'Successful Admission', hint: 'Nəticələnən qəbullar' },
  { key: 'visa_help', label: 'Visa Help', hint: 'Viza dəstəyi verdiyimiz şəxslər' },
  { key: 'successful_visa_help', label: 'Successful Visa Help', hint: 'Nəticələnən viza müraciətləri' },
];

const EDITABLE = FIELDS.filter((field) => !field.readOnly);

const EMPTY = EDITABLE.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});
const STATUS_IDLE = { state: 'idle', message: '' };

export default function WebPropertiesManager() {
  const [form, setForm] = useState(EMPTY);
  const [rate, setRate] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(STATUS_IDLE);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getWebProperties();
      setExists(Boolean(data));
      setRate(data?.visa_success_rate ?? null);

      if (data) {
        setForm(
          EDITABLE.reduce(
            (acc, field) => ({ ...acc, [field.key]: String(data[field.key] ?? 0) }),
            EMPTY,
          ),
        );
      }
      setStatus(STATUS_IDLE);
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Rəqəmlər yüklənmədi') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(STATUS_IDLE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const data = await addWebProperties(form);
      if (data && data.is_created === false) {
        const first = data?.errors?.[0]?.error_message ?? data?.errors?.[0]?.message;
        setStatus({ state: 'error', message: first || 'Rəqəmlər yadda saxlanmadı' });
        return;
      }

      await load();
      setStatus({
        state: 'success',
        message: 'Rəqəmlər yadda saxlandı və ana səhifə yeniləndə göstəriləcək.',
      });
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Rəqəmlər yadda saxlanmadı') });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className={SECTION_TITLE}>Web Config</h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-4 py-2 text-[12px] text-[#080d4a] hover:bg-[#f0f4f8] rounded-full transition disabled:opacity-50"
        >
          {loading ? 'Yüklənir...' : 'Yenilə'}
        </button>
      </div>

      <p className="text-[#323643]/60 text-[12px] -mt-3">
        Ana səhifədəki rəqəmlər buradan idarə olunur. Yazma{' '}
        <code className="text-[#080d4a]">POST /property/add</code>, oxuna{' '}
        <code className="text-[#080d4a]">GET /property/all</code> ilə həyata keçirilir.
      </p>

      {status.message && (
        <p
          role="status"
          className={`text-[12px] ${
            status.state === 'error'
              ? 'text-red-600'
              : status.state === 'success'
                ? 'text-[#1a8a99]'
                : 'text-[#323643]/60'
          }`}
        >
          {status.message}
        </p>
      )}

      {!loading && !exists && (
        <p className="text-[12px] text-[#a06a00] bg-[#fff4dc] rounded px-3 py-2">
          Backend-də hələ rəqəm sətri yoxdur —{' '}
          <code className="text-[#080d4a]">GET /property/all</code> bu halda{' '}
          <code className="text-[#080d4a]">WEB_PROPERTY_NOT_FOUND</code> qaytarır. Ana səhifə
          bu halda statik rəqəmləri göstərir; aşağıdakı formu göndərdikdən sonra əsl rəqəmlər
          işə düşəcək.
        </p>
      )}

      <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className={FIELD_LABEL} htmlFor={`wp-${field.key}`}>
              {field.label}
              {field.readOnly ? ' (hesablanır)' : ''}
            </label>

            <div className="relative">
              {field.readOnly && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#323643]/40">
                  %
                </span>
              )}
              <input
                id={`wp-${field.key}`}
                name={field.key}
                type="number"
                min="0"
                step="1"
                readOnly={field.readOnly}
                tabIndex={field.readOnly ? -1 : undefined}
                value={field.readOnly ? (rate === null ? '' : rate) : form[field.key]}
                onChange={handleChange}
                placeholder={field.readOnly ? 'hesablanacaq' : '0'}
                aria-readonly={field.readOnly || undefined}
                className={`${FIELD_INPUT} ${
                  field.readOnly
                    ? 'bg-[#ececec] text-[#323643]/55 cursor-not-allowed pr-9'
                    : ''
                }`}
              />
            </div>

            <p className="mt-1 text-[10px] text-[#323643]/45">{field.hint}</p>
          </div>
        ))}

        <div className="sm:col-span-2 flex justify-end">
          <button type="submit" disabled={status.state === 'loading'} className={BTN_PRIMARY}>
            {status.state === 'loading' ? 'Göndərilir...' : 'Yadda saxla'}
          </button>
        </div>
      </form>
    </section>
  );
}
