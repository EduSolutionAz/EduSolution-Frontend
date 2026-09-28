import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addApplicantComment } from '../../services/contentApi';
import { isUserAuthenticated } from '../../services/session';
import { SERVICE_OPTIONS } from '../../services/mappers';

const LIMITS = { NAME_MAX: 50, COMMENT_MIN: 10, COMMENT_MAX: 256 };

const INPUT =
  'w-full h-[42px] bg-[#f6eeee] rounded-full px-5 text-[13px] text-[#323643] outline-none placeholder-[#323643]/60 focus:ring-2 focus:ring-[#26aec4] transition';

export default function WriteReviewSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [form, setForm] = useState({ name: '', service: SERVICE_OPTIONS[0].value, comment: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const length = form.comment.trim().length;
  const canSubmit =
    form.name.trim().length > 0 &&
    form.name.trim().length <= LIMITS.NAME_MAX &&
    length >= LIMITS.COMMENT_MIN &&
    length <= LIMITS.COMMENT_MAX;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status.state !== 'idle') setStatus({ state: 'idle', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus({ state: 'loading', message: '' });

    try {
      const data = await addApplicantComment({
        name: form.name.trim(),
        comment: form.comment.trim(),
        service: form.service,
      });

      if (data?.isAdded) {
        setForm({ name: '', service: form.service, comment: '' });
        setStatus({ state: 'success', message: 'Rəyiniz qeydə alındı. Təşəkkür edirik!' });
        return;
      }

      setStatus({
        state: 'error',
        message:
          (data?.errors || [])[0]?.message ||
          'Rəy əlavə edilmədi. Məlumatları yoxlayıb yenidən cəhd edin.',
      });
    } catch (err) {
      if (err?.status === 401) {
        setIsLoggedIn(false);
        setStatus({ state: 'error', message: 'Rəy göndərmək üçün giriş etməlisiniz.' });
        return;
      }
      setStatus({ state: 'error', message: err?.message || 'Xəta baş verdi.' });
    }
  };

  return (
    <section
      id="write-review"
      className="bg-[#fdf6f3] py-10 sm:py-14"
      style={{
        backgroundImage: `linear-gradient(rgba(253,246,243,0.94), rgba(253,246,243,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px auto',
      }}
    >
      <div className="max-w-[520px] mx-auto px-4">
        <h2 className="text-center text-[#1a2e5a] font-heading font-bold text-[20px] sm:text-[24px] tracking-wide mb-2">
          Share your experience
        </h2>
        <p className="text-center text-[#1a2e5a]/60 text-[12px] mb-6">
          Təcrübənizi paylaşın — rəyiniz sayğımızda əhəmiyyətli rol oynayır.
        </p>

        {!isLoggedIn ? (
          <div className="bg-white rounded-lg shadow px-6 py-8 text-center">
            <p className="text-[#323643]/70 text-[13px] mb-5">
              Rəy yazmaq üçün hesabınıza giriş etməlisiniz.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full bg-[#080d4a] text-white text-[13px] font-semibold hover:bg-[#141c63] transition"
              >
                Giriş et
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full border border-[#080d4a]/30 text-[#080d4a] text-[13px] font-semibold hover:bg-[#080d4a]/5 transition"
              >
                Qeydiyyatdan keç
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow px-6 py-6 space-y-4">
            <div>
              <label
                htmlFor="review-name"
                className="block text-[#323643]/70 text-[11px] mb-1"
              >
                Adınız *
              </label>
              <input
                id="review-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ad və Soyad"
                className={INPUT}
                required
              />
            </div>

            <div>
              <label
                htmlFor="review-service"
                className="block text-[#323643]/70 text-[11px] mb-1"
              >
                Xidmət növü *
              </label>
              <select
                id="review-service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className={`${INPUT} cursor-pointer`}
              >
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="review-text"
                className="block text-[#323643]/70 text-[11px] mb-1"
              >
                Rəyiniz *
              </label>
              <textarea
                id="review-text"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows={5}
                maxLength={LIMITS.COMMENT_MAX}
                placeholder="Təcrübənizi yazın..."
                className="w-full bg-[#f6eeee] rounded-2xl px-4 py-3 text-[13px] text-[#323643] outline-none placeholder-[#323643]/60 focus:ring-2 focus:ring-[#26aec4] resize-y leading-6 transition"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-[11px] ${
                    length > 0 && (length < LIMITS.COMMENT_MIN || length > LIMITS.COMMENT_MAX)
                      ? 'text-red-600'
                      : 'text-[#323643]/50'
                  }`}
                >
                  {length < LIMITS.COMMENT_MIN
                    ? `Ən azı ${LIMITS.COMMENT_MIN} simvol`
                    : `${length}/${LIMITS.COMMENT_MAX}`}
                </span>
              </div>
            </div>

            {status.message && (
              <p
                role="status"
                className={`text-center text-[12px] ${
                  status.state === 'success' ? 'text-[#1a8a99]' : 'text-red-600'
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || status.state === 'loading'}
              className="w-full h-[42px] bg-[#26aec4] text-[#080d4a] rounded-full font-accent font-semibold text-[13px] hover:bg-[#3cc3d8] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.state === 'loading' ? 'Göndərilir...' : 'Rəyi göndər'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
