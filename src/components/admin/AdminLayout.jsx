import { NavLink, Outlet } from 'react-router-dom';

const MENU = [
  { to: '/admin/countries', label: 'Countries', icon: '' },
  { to: '/admin/universities', label: 'Universities', icon: '' },
  { to: '/admin/faculties', label: 'Faculties', icon: '' },
  { to: '/admin/ads', label: 'Ad Board', icon: '' },
  { to: '/admin/prizes', label: 'Spin Prizes', icon: '' },
  { to: '/admin/comments', label: 'Comment URLs', icon: '' },
];

export default function AdminLayout() {
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
        <div className="p-4 border-t border-white/10">
          <a
            href="/"
            className="flex items-center gap-2 text-[12px] text-white/70 hover:text-white transition-colors"
          >
            ← Back to Site
          </a>
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
