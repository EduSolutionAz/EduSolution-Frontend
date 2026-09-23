import { useState, useSyncExternalStore } from 'react';
import {
  addFaculty,
  getCountries,
  getFaculties,
  removeFaculty,
  subscribe,
} from '../../store/adminStore';

function getSnapshot() {
  return getCountries();
}

function getServerSnapshot() {
  return getCountries();
}

export default function FacultiesManager() {
  const countries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]?.slug || '');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [name, setName] = useState('');

  const currentCountry = countries.find((c) => c.slug === selectedCountry);
  const universities = currentCountry?.universities || [];
  const faculties = selectedUniversity
    ? getFaculties(selectedCountry, selectedUniversity)
    : [];

  const selectedUniName = universities.find((u) => u.id === selectedUniversity)?.name;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedUniversity) return;
    addFaculty(selectedCountry, selectedUniversity, name.trim());
    setName('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Fakultəni silmək istəyirsiz?')) {
      removeFaculty(selectedCountry, selectedUniversity, id);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
        Fakultələr
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-[#323643]/70 mb-1">
            Ölkə seçin
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedUniversity('');
            }}
            className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
          >
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-[#323643]/70 mb-1">
            Universitet seçin
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            disabled={!universities.length}
          >
            <option value="" disabled>
              Universitet seçin
            </option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUniversity ? (
        <>
          <p className="text-[12px] text-[#323643]/70">
            Seçilmiş: <strong>{selectedUniName}</strong>
          </p>

          <form onSubmit={handleAdd} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[11px] text-[#323643]/70 mb-1">
                Fakultə adı *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məsələn: Computer Engineering"
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
            {faculties.map((f) => (
              <li
                key={f.id}
                className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between"
              >
                <span className="text-[#080d4a] text-[14px]">{f.name}</span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="px-3 py-1 text-red-600 text-[12px] font-medium hover:bg-red-50 rounded transition"
                >
                  Sil
                </button>
              </li>
            ))}
            {faculties.length === 0 && (
              <li className="text-center py-8 text-[#323643]/50 text-[13px]">
                Bu universitetdə fakultə yoxdur
              </li>
            )}
          </ul>
        </>
      ) : (
        <p className="text-center py-8 text-[#323643]/50 text-[13px]">
          Fakultə əlavə etmək üçün universitet seçin
        </p>
      )}
    </section>
  );
}
