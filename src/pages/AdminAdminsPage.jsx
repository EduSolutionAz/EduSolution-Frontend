import { useState } from 'react';
import { adminRegister } from '../services/authApi';
import {
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from '../components/admin/fields';

const LIMITS = {
  USERNAME_MAX: 20,
  EMAIL_MAX: 75,
  PASSWORD_MIN: 9,
  PASSWORD_MAX: 30,
};

// Mirrors AdminLogRequestDTO / AdminRegisterRequestDTO on the backend:
// at least 9 chars, one uppercase, one lowercase, one digit and one of . , # ? /
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[.,#?/]).+$/;
const EMAIL_RE = /^[^\s@]+@[^\s]+\.[^\s]{2,}$/;

function validate(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = 'E-poçt tələb olunur';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Yanlış email formatı';
  } else if (form.email.trim().length > LIMITS.EMAIL_MAX) {
    errors.email = `E-poçt ${LIMITS.EMAIL_MAX} simvoldan uzun ola bilməz`;
  }

  if (!form.username.trim()) {
    errors.username = 'İstifadəçi adı tələb olunur';
  } else if (form.username.trim().length > LIMITS.USERNAME_MAX) {
    errors.username = `İstifadəçi adı ${LIMITS.USERNAME_MAX} simvoldan uzun ola bilməz`;
  }

  if (!form.password) {
    errors.password = 'Şifrə tələb olunur';
  } else if (
    form.password.length < LIMITS.PASSWORD_MIN ||
    form.password.length > LIMITS.PASSWORD_MAX
  ) {
    errors.password = `Şifrə ${LIMITS.PASSWORD_MIN}-${LIMITS.PASSWORD_MAX} simvol olmalıdır`;
  } else if (!PASSWORD_RE.test(form.password)) {
    errors.password =
      'Şifrə böyük hərf, kiçik hərf, rəqəm və . , # ? / simvollarından birini içərməlidir';
  }

  return errors;
}

const EMPTY = { username: '', email: '', password: '' };

export default function AdminAdminsPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [created, setCreated] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus({ state: 'idle', message: '' });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setStatus({ state: 'loading', message: '' });

    try {
      const data = await adminRegister({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // The backend answers 200 with an empty body on this endpoint, so
      // an explicit is_registered === false is the only clear rejection.
      if (data?.is_registered === false) {
        setStatus({ state: 'error', message: 'Admin qeydiyyatı alınmadı. E-poçt artıq istifadə oluna bilər.' });
        return;
      }

      setCreated((prev) => [
        { id: `${form.email}-${prev.length}`, email: form.email.trim(), username: form.username.trim() },
        ...prev,
      ]);
      setForm(EMPTY);
      setStatus({
        state: 'success',
        message: `${form.email.trim()} üçün admin qeydiyyatı göndərildi.`,
      });
    } catch (err) {
      const first = err?.errors?.[0]?.message;
      setStatus({ state: 'error', message: first || err?.message || 'Qeydiyyat alınmadı.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className={SECTION_TITLE}>Yeni admin</h2>

      <p className="text-[#323643]/60 text-[12px] -mt-3">
        Yeni administrator hesabı yaradın. Şifrə{' '}
        <strong className="text-[#323643]">9-30 simvol</strong> olmalı, içində böyük hərf,
        kiçik hərf, rəqəm və <strong className="text-[#323643]">. , # ? /</strong> simvollarından
        biri olmalıdır.
      </p>

      <form onSubmit={handleSubmit} className={`${CARD} space-y-4`}>
        <div>
          <label className={FIELD_LABEL} htmlFor="admin-new-username">İstifadəçi adı *</label>
          <input
            id="admin-new-username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Məsələn: moderator"
            className={FIELD_INPUT}
            required
          />
          {errors.username && (
            <p className="mt-1 text-[11px] text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="admin-new-email">E-poçt *</label>
          <input
            id="admin-new-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className={FIELD_INPUT}
            required
          />
          {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="admin-new-password">Şifrə *</label>
          <input
            id="admin-new-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Abc12345."
            className={FIELD_INPUT}
            required
          />
          {errors.password && (
            <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>
          )}
        </div>

        {status.message && (
          <p
            role="status"
            className={`text-[12px] ${status.state === 'success' ? 'text-[#1a8a99]' : 'text-red-600'}`}
          >
            {status.message}
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className={BTN_PRIMARY}>
            {isSaving ? 'Göndərilir...' : 'Admin yarat'}
          </button>
        </div>
      </form>

      {created.length > 0 && (
        <>
          <h3 className="text-[#080d4a] text-[16px] font-semibold">
            Bu sessiyada əlavə olunanlar ({created.length})
          </h3>
          <ul className="space-y-2" role="list">
            {created.map((item) => (
              <li
                key={item.id}
                className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-[#080d4a] text-[13px] font-medium truncate">{item.username}</p>
                  <p className="text-[#323643]/50 text-[11px] truncate">{item.email}</p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#26aec4]/15 text-[#1a8a99] text-[10px] font-medium">
                  Göndərildi
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[#323643]/50 text-[11px]">
            Backend bu hesabları qaytarmır — siyahı yalnız bu sessiyada görünür.
          </p>
        </>
      )}

      {created.length === 0 && (
        <p className="text-center py-6 text-[#323643]/50 text-[13px]">
          Hələ admin əlavə edilməyib
        </p>
      )}
    </section>
  );
}
