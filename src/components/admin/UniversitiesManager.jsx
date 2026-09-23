import { useState, useSyncExternalStore } from 'react';
import {
  addUniversity,
  getCountries,
  getUniversities,
  removeUniversity,
  subscribe,
} from '../../store/adminStore';

export default function UniversitiesManager() {
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [selectedSlug, setSelectedSlug] = useState(countries[0]?.slug || '');
  const [name, setName] = useState('');

  const universities = selectedSlug ? getUniversities(selectedSlug) : [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedSlug) return;
    addUniversity(selectedSlug, name.trim());
    setName('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Universiteti silmək istəyirsiz?')) {
      removeUniversity(selectedSlug, id);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
        Universitetlər
      </h2>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-[11px] text-[#323643]/70 mb-1">
            Ölkə seçin
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
          >
            <option value="" disabled>
              Ölkə seçin
            </option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSlug && (
        <>
          <form onSubmit={handleAdd} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[11px] text-[#323643]/70 mb-1">
                Universitet adı *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məsələn: Baku State University"
                className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
                required
              />
            </div>
            <button
              type="submit"
              className="h-[42px] px-5 bg-[#26aec4] text-[#080d4a] font-accent font-semibold rounded-full hover:bg-[#3cc3d8] transition text-[13px]"
            >
              Əlavə et
            </button>
          </form>

          <ul className="space-y-2" role="list">
            {universities.map((u) => (
              <li
                key={u.id}
                className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between"
              >
                <span className="text-[#080d4a] text-[14px]">{u.name}</span>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-3 py-1 text-red-600 text-[12px] font-medium hover:bg-red-50 rounded transition"
                >
                  Sil
                </button>
              </li>
            ))}
            {universities.length === 0 && (
              <li className="text-center py-8 text-[#323643]/50 text-[13px]">
                Bu ölkədə universitet yoxdur
              </li>
            )}
          </ul>
        </>
      )}

      {!selectedSlug && (
        <p className="text-center py-8 text-[#323643]/50 text-[13px]">
          Universitet əlavə etmək üçün ölkə seçin
        </p>
      )}
    </section>
  );
}
