import { useState, useSyncExternalStore } from 'react';
import {
  addFaq,
  getFaqs,
  moveFaq,
  removeFaq,
  subscribe,
  updateFaq,
} from '../../store/adminStore';
import {
  BTN_ACCENT,
  BTN_DELETE,
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  FIELD_TEXTAREA,
  SECTION_TITLE,
} from './fields';

const EMPTY_FORM = { question: '', answer: '' };

export default function FaqManager() {
  const faqs = useSyncExternalStore(subscribe, getFaqs, getFaqs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;

    const saved = editingId
      ? updateFaq(editingId, { question: form.question.trim(), answer: form.answer.trim() })
      : addFaq(form.question.trim(), form.answer.trim());

    if (!saved) {
      window.alert('Yadda saxlamaq mümkün olmadı — brauzer yaddaş limiti dolub.');
      return;
    }

    closeForm();
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer });
    setEditingId(faq.id);
    setShowForm(true);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>FAQ</h2>
        <button
          type="button"
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={BTN_ACCENT}
        >
          {showForm ? 'İmtina' : 'Əlavə et'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} space-y-4`}>
          <div>
            <label className={FIELD_LABEL} htmlFor="faq-question">Sual *</label>
            <input
              id="faq-question"
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Sualı yazın"
              className={FIELD_INPUT}
              required
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="faq-answer">Cavab *</label>
            <textarea
              id="faq-answer"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows={5}
              placeholder="Cavabı yazın"
              className={FIELD_TEXTAREA}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeForm} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" className={BTN_PRIMARY}>
              {editingId ? 'Yenilə' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2" role="list">
        {faqs.map((faq, index) => (
          <li key={faq.id} className="bg-white rounded-md shadow px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#080d4a] text-[14px] font-medium">{faq.question}</p>
                <p className="text-[#323643]/60 text-[12px] leading-5 mt-1 line-clamp-2">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveFaq(faq.id, -1)}
                  disabled={index === 0}
                  aria-label="Yuxarı"
                  className="px-2 py-1 text-[#323643]/50 text-[12px] hover:bg-[#f6eeee] rounded disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveFaq(faq.id, 1)}
                  disabled={index === faqs.length - 1}
                  aria-label="Aşağı"
                  className="px-2 py-1 text-[#323643]/50 text-[12px] hover:bg-[#f6eeee] rounded disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(faq)}
                  className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition"
                >
                  Redaktə
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bu sualı silmək istəyirsiz?')) removeFaq(faq.id);
                  }}
                  className={BTN_DELETE}
                >
                  Sil
                </button>
              </div>
            </div>
          </li>
        ))}
        {faqs.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Hələ FAQ yoxdur</li>
        )}
      </ul>
    </section>
  );
}
