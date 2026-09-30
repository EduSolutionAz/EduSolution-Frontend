import { useEffect, useState } from 'react';
import { addFaculty, deleteFaculty, getFaculties } from '../../services/contentApi';
import { useAllCountries } from '../../services/contentHooks';
import { mapFaculties } from '../../services/mappers';
import UniversityPicker from './UniversityPicker';
import { handleAuthFailure, isAuthFailure } from '../../services/session';
import { BTN_ACCENT, BTN_DELETE, FIELD_INPUT, FIELD_LABEL, SECTION_TITLE } from './fields';

export default function FacultiesManager() {
  const { data, loading: loadingCountries } = useAllCountries();
  const countries = data || [];

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [name, setName] = useState('');

  const [faculties, setFaculties] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const activeCountry = selectedCountry || countries[0]?.name || '';

  useEffect(() => {
    if (!selectedUniversity) {
      setFaculties([]);
      return undefined;
    }

    let active = true;
    setLoadingFaculties(true);
    setError('');

    getFaculties({ universityName: selectedUniversity })
      .then((result) => {
        if (active) setFaculties(mapFaculties(result));
      })
      .catch((err) => {
        if (!active) return;
        setFaculties([]);
        setError(err?.message || 'Fakultələr yüklənmədi.');
      })
      .finally(() => {
        if (active) setLoadingFaculties(false);
      });

    return () => {
      active = false;
    };
  }, [selectedUniversity]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedUniversity) return;

    setIsSaving(true);
    setError('');

    try {
      const result = await addFaculty({
        facultyName: name.trim(),
        universityName: selectedUniversity,
      });

      if (result?.is_created) {
        setName('');
        setFaculties((prev) => [
          ...prev,
          { id: name.trim(), name: name.trim() },
        ]);
      } else {
        setError((result?.errors || [])[0]?.message || 'Fakultə əlavə edilmədi.');
      }
    } catch (err) {
      setError(
        isAuthFailure(err)
          ? 'Admin sessiyası etibarsızdır. Yenidən daxil olun.'
          : err?.message || 'Fakultə əlavə edilmədi.',
      );
      if (isAuthFailure(err)) handleAuthFailure();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (facultyName) => {
    if (!window.confirm(`"${facultyName}" fakultəsi silinsin?`)) return;

    setError('');
    try {
      const result = await deleteFaculty({
        facultyName,
        universityName: selectedUniversity,
      });
      if (result?.is_deleted) {
        setFaculties((prev) => prev.filter((f) => f.name !== facultyName));
      }
    } catch (err) {
      setError(
        isAuthFailure(err)
          ? 'Admin sessiyası etibarsızdır. Yenidən daxil olun.'
          : err?.message || 'Fakultə silinmədi.',
      );
      if (isAuthFailure(err)) handleAuthFailure();
    }
  };

  return (
    <section className="space-y-6">
      <h2 className={SECTION_TITLE}>Fakultələr</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={FIELD_LABEL} htmlFor="fac-country">
            Ölkə seçin
          </label>
          <select
            id="fac-country"
            value={activeCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedUniversity('');
              setFaculties([]);
            }}
            className={FIELD_INPUT}
            disabled={loadingCountries}
          >
            {countries.length === 0 && <option value="">Ölkə yoxdur</option>}
            {countries.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <UniversityPicker
            value={selectedUniversity}
            onChange={setSelectedUniversity}
            countryName={activeCountry}
            disabled={loadingCountries}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-[12px]">
          {error}
        </p>
      )}

      {selectedUniversity ? (
        <>
          <p className="text-[12px] text-[#323643]/70">
            Seçilmiş: <strong>{selectedUniversity}</strong>
          </p>

          <form onSubmit={handleAdd} className="flex items-end gap-3">
            <div className="flex-1">
              <label className={FIELD_LABEL} htmlFor="fac-name">
                Fakultə adı *
              </label>
              <input
                id="fac-name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məsələn: Computer Engineering"
                className={FIELD_INPUT}
                required
              />
            </div>
            <button type="submit" disabled={isSaving} className={`h-[42px] ${BTN_ACCENT}`}>
              {isSaving ? 'Göndərilir...' : 'Əlavə et'}
            </button>
          </form>

          {loadingFaculties ? (
            <p className="text-center py-8 text-[#323643]/50 text-[13px]">Yüklənir...</p>
          ) : (
            <ul className="space-y-2" role="list">
              {faculties.map((f) => (
                <li
                  key={f.id}
                  className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-[#080d4a] text-[14px]">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.name)}
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
          )}
        </>
      ) : (
        <p className="text-center py-8 text-[#323643]/50 text-[13px]">
          Fakultə əlavə etmək üçün universitet adı yazın
        </p>
      )}
    </section>
  );
}
