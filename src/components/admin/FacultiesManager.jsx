import { useState, useSyncExternalStore } from 'react';
import {
  addFaculty,
  getCountries,
  getFaculties,
  removeFaculty,
  subscribe,
} from '../../store/adminStore';
import { getUniversityName } from '../../utils/format';
import { BTN_ACCENT, BTN_DELETE, FIELD_INPUT, FIELD_LABEL, SECTION_TITLE } from './fields';

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

  const selectedUniName = universities.find((u) => u.id === selectedUniversity)
    ? getUniversityName(universities.find((u) => u.id === selectedUniversity))
    : '';

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
      <h2 className={SECTION_TITLE}>
        Fakultələr
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={FIELD_LABEL}>
            Ölkə seçin
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedUniversity('');
            }}
            className={FIELD_INPUT}
          >
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={FIELD_LABEL}>
            Universitet seçin
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className={FIELD_INPUT}
            disabled={!universities.length}
          >
            <option value="" disabled>
              Universitet seçin
            </option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {getUniversityName(u)}
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
              <label className={FIELD_LABEL}>
                Fakultə adı *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məsələn: Computer Engineering"
                className={FIELD_INPUT}
                required
              />
            </div>
            <button
              type="submit"
              className={`h-[42px] ${BTN_ACCENT}`}
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
                  className={BTN_DELETE}
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
