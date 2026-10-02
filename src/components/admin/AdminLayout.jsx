import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { resetStore } from '../../store/adminStore';
import { clearAdminToken } from '../../services/session';
import { ADMIN_TOKEN_KEY } from '../../config/api';
import { readToken } from '../../services/httpClient';

/**
 * Shows whether an admin token is actually stored. A stale or missing token
 * makes every write endpoint answer 200 with an empty body, which is
 * impossible to tell apart from a real failure without this.
 */
function TokenStatus() {
  const token = readToken(ADMIN_TOKEN_KEY);

  if (!token) {
    return (
      <p className="text-[10px] leading-[1.5] text-red-300">
        Admin tokeni yoxdur. Yazma sorğuları 403 qaytaracaq —{' '}
        <a href="/admin/login" className="underline text-white/80">
          daxil olun
        </a>
        .
      </p>
    );
  }

  const looksLikeJwt = token.split('.').length === 3;

  return (
    <p className="text-[10px] leading-[1.5] text-white/50">
      Token: {token.slice(0, 12)}… ({token.length} simvol)
      {looksLikeJwt ? ' · JWT formatında' : ' · JWT DEYİL'}
    </p>
  );
}

const MENU = [
  { to: '/admin/countries', label: 'Countries', icon: '' },
  { to: '/admin/universities', label: 'Universities', icon: '' },
  { to: '/admin/faculties', label: 'Faculties', icon: '' },
  { to: '/admin/faqs', label: 'FAQ', icon: '' },
  { to: '/admin/ads', label: 'Ad Board', icon: '' },
  { to: '/admin/prizes', label: 'Spin Prizes', icon: '' },
  { to: '/admin/comments', label: 'Comment URLs', icon: '' },
  { to: '/admin/admins', label: 'Admins', icon: '' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#f6eeee] font-sans overflow-x-hidden">
      <aside className="w-64 sm:w-72 bg-[#080d4a] text-white flex flex-col shrink-0">
        <div className="h-[60px] sm:h-[70px] flex items-center gap-2 px-5 border-b border-white/10">
          <span className="text-[22px] leading-none">🛠</span>
          <h1 className="font-heading font-bold text-[16px]">Admin Panel</h1>
        </div>
        <nav className="flex-1 py-4" role="list">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="listitem"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-[13px] font-accent transition-colors ${
                  isActive
                    ? 'bg-[#26aec4] text-[#080d4a] font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-[16px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-3">
          <TokenStatus />

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Bütün demo məlumatlar silinib ilkin vəziyyətə qaytarılacaq (ölkələr, universitetlər, FAQ, reklamlar, nağıllar, şərhlər). Davam etmək istəyirsiniz?',
                )
              ) {
                resetStore();
              }
            }}
            className="w-full px-3 py-1.5 text-left text-[11px] text-white/50 hover:text-white hover:bg-white/10 rounded transition"
          >
            Demo datanı sıfırla
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3 py-1.5 text-left text-[11px] text-white/50 hover:text-white hover:bg-white/10 rounded transition"
          >
            Çıxış
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
