import { useState, useSyncExternalStore } from 'react';
import { addPrize, getPrizes, removePrize, subscribe } from '../../store/adminStore';

export default function SpinPrizesManager() {
  const prizes = useSyncExternalStore(subscribe, getPrizes, getPrizes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', probability: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'probability' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addPrize(form.name.trim(), form.probability);
    setForm({ name: '', probability: 0 });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Nağıdı silmək istəyirsiz?')) {
      removePrize(id);
    }
  };

  const totalProb = prizes.reduce((sum, p) => sum + (p.probability || 0), 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
          Spin Nağılları
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-5 py-2 bg-[#26aec4] text-[#080d4a] font-accent font-semibold rounded-full hover:bg-[#3cc3d8] transition text-[13px]"
        >
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="block text-[11px] text-[#323643]/70 mb-1">
              Nağıl adı *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Məsələn: 10% endirim"
              className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#323643]/70 mb-1">
              Ehtimallılıq (%)
            </label>
            <input
              type="number"
              name="probability"
              value={form.probability}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 text-[12px]"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#080d4a] text-white text-[12px] rounded-full hover:bg-[#141c63] transition"
            >
              Əlavə et
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-[12px] text-[#323643]/70 mb-3">
          Cəm: <strong>{totalProb}%</strong>
        </p>
        <ul className="space-y-2" role="list">
          {prizes.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <span className="text-[#080d4a] text-[14px] font-medium">{p.name}</span>
                <span className="text-[#323643]/50 text-[12px]"> ({p.probability || 0}%)</span>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 text-red-600 text-[12px] font-medium hover:bg-red-50 rounded transition"
              >
                Sil
              </button>
            </li>
          ))}
          {prizes.length === 0 && (
            <li className="text-center py-6 text-[#323643]/50 text-[13px]">
              Heç bir nağıl yoxdur
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
