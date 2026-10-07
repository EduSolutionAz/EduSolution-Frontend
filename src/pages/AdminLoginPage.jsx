import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/authApi';
import { markAdminVerified, clearAdminToken } from '../services/session';
import { ADMIN_TOKEN_KEY } from '../config/api';
import { readToken } from '../services/httpClient';

const INPUT =
  'w-full h-[42px] bg-white/95 border border-white/30 rounded px-4 text-[13px] text-[#080d4a] outline-none focus:border-[#26aec4] transition';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [report, setReport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Leaving the login screen also ends any stored session, so the next visit
  // to /admin asks for the credentials again.
  const handleLeaveSite = () => {
    clearAdminToken();
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setReport('');

    try {
      const data = await adminLogin({
        username: form.username.trim(),
        password: form.password,
      });

      const stored = readToken(ADMIN_TOKEN_KEY);
      setReport(
        [
          `Server cavabı: ${data === null ? 'boş (200, content-length 0)' : JSON.stringify(data)}`,
          `localStorage-də saxlanan token: ${stored ? `${stored.slice(0, 16)}… (${stored.length} simvol)` : 'YOXDUR'}`,
        ].join('\n'),
      );

      if (!data?.token) {
        setError('Server giriş cavabında token qaytarmadı. Admin hesabını yoxlayın.');
        return;
      }

      markAdminVerified();
      navigate('/admin', { replace: true });
    } catch (err) {
      setReport(
        [
          `Status: [${err?.status ?? '?'}] ${err?.code ?? ''}`,
          `Mesaj: ${err?.message ?? 'naməlum'}`,
          `Cavab body: ${err?.body ? JSON.stringify(err.body) : 'yoxdur'}`,
          `localStorage token: ${readToken(ADMIN_TOKEN_KEY) ? 'var' : 'yoxdur'}`,
        ].join('\n'),
      );

      if (err?.status === 401 || err?.status === 403) {
        setError(
          'İstifadəçi adı və ya şifrə yanlışdır. Şifrə 9-30 simvol olmalı, içində böyük hərf, kiçik hərf, rəqəm və . , # ? / simvollarından biri olmalıdır.',
        );
        return;
      }
      setError(err?.message || 'Giriş uğursuz oldu. Yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{
        backgroundColor: '#080d4a',
        backgroundImage: `linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-7">
          <h1 className="text-white text-[22px] font-heading font-bold tracking-wide">Admin Panel</h1>
          <p className="text-white/60 text-[12px] mt-1.5">Davam etmək üçün daxil olun</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a1145] rounded-lg px-6 py-7 space-y-4">
          <div>
            <label htmlFor="admin-user" className="block text-white/80 text-[11px] mb-1.5">
              İstifadəçi adı
            </label>
            <input
              id="admin-user"
              type="text"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              className={INPUT}
              required
            />
          </div>

          <div>
            <label htmlFor="admin-pass" className="block text-white/80 text-[11px] mb-1.5">
              Şifrə
            </label>
            <input
              id="admin-pass"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className={INPUT}
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-red-300 text-[12px]">
              {error}
            </p>
          )}

          {report && (
            <pre className="bg-black/40 text-[#8ef6e4] text-[10px] rounded p-2.5 overflow-x-auto whitespace-pre-wrap break-all">
              {report}
            </pre>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[42px] bg-[#26aec4] text-[#080d4a] rounded-full font-accent font-semibold text-[13px] hover:bg-[#3cc3d8] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Daxil olunur...' : 'Daxil ol'}
          </button>

          <button
            type="button"
            onClick={handleLeaveSite}
            className="block w-full text-center text-white/50 text-[11px] hover:text-white transition-colors"
          >
            ← Ana səhifəyə qayıt
          </button>
        </form>
      </div>
    </div>
  );
}
