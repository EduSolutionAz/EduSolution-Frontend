import { useState } from 'react';
import { ADMIN_TOKEN_KEY } from '../../config/api';
import { createFaq, deleteFaq, updateFaq } from '../../services/contentApi';
import { useFaqs } from '../../services/contentHooks';
import { describeFailure } from '../../services/httpClient';
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
const STATUS_IDLE = { state: 'idle', message: '' };

export default function FaqManager() {
  const { data: faqs, loading, error, reload } = useFaqs();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(STATUS_IDLE);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(STATUS_IDLE);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setStatus(STATUS_IDLE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || !form.question.trim() || !form.answer.trim()) return;

    setSaving(true);
    setStatus(STATUS_IDLE);

    try {
      const question = form.question.trim();
      const answer = form.answer.trim();

      if (editingId) {
        const response = await updateFaq(
          { id: editingId, question, answer },
          { tokenKey: ADMIN_TOKEN_KEY },
        );
        if (response?.is_updated !== true) throw new Error('FAQ yenilənmədi');
      } else {
        const response = await createFaq(
          { question, answer },
          { tokenKey: ADMIN_TOKEN_KEY },
        );
        if (response?.is_created !== true || !response?.faq_id) {
          throw new Error('FAQ yaradılmadı');
        }
      }

      reload();
      closeForm();
      setStatus({ state: 'success', message: 'FAQ uğurla yadda saxlanıldı' });
    } catch (requestError) {
      setStatus({
        state: 'error',
        message: describeFailure(requestError, 'FAQ yadda saxlanılmadı'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer });
    setEditingId(faq.id);
    setStatus(STATUS_IDLE);
    setShowForm(true);
  };

  const handleDelete = async (faq) => {
    if (deletingId || !window.confirm('Bu sualı silmək istəyirsiz?')) return;

    setDeletingId(faq.id);
    setStatus(STATUS_IDLE);

    try {
      const response = await deleteFaq(faq.id, { tokenKey: ADMIN_TOKEN_KEY });
      if (response?.is_deleted !== true) throw new Error('FAQ silinmədi');
      reload();
      if (editingId === faq.id) closeForm();
      setStatus({ state: 'success', message: 'FAQ silindi' });
    } catch (requestError) {
      setStatus({
        state: 'error',
        message: describeFailure(requestError, 'FAQ silinmədi'),
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={SECTION_TITLE}>FAQ</h2>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              closeForm();
            } else {
              setStatus(STATUS_IDLE);
              setShowForm(true);
            }
          }}
          className={BTN_ACCENT}
          disabled={saving || Boolean(deletingId)}
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
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="px-4 py-1.5 text-[12px] disabled:opacity-50"
            >
              Ləğv et
            </button>
            <button type="submit" className={BTN_PRIMARY} disabled={saving || Boolean(deletingId)}>
              {saving ? 'Yadda saxlanılır…' : editingId ? 'Yenilə' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      {status.message && (
        <p
          role={status.state === 'error' ? 'alert' : 'status'}
          className={`text-[12px] ${status.state === 'error' ? 'text-red-600' : 'text-emerald-700'}`}
        >
          {status.message}
        </p>
      )}

      {error && (
        <div role="alert" className="text-[12px] text-red-600">
          {describeFailure(error, 'FAQ-lar yüklənmədi')}{' '}
          <button type="button" onClick={reload} className="underline">Yenidən cəhd et</button>
        </div>
      )}

      <ul className="space-y-2" role="list">
        {faqs.map((faq) => (
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
                  onClick={() => handleEdit(faq)}
                  disabled={saving || Boolean(deletingId)}
                  className="px-3 py-1 text-[#26aec4] text-[12px] font-medium hover:bg-[#26aec4]/10 rounded transition disabled:opacity-50"
                >
                  Redaktə
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(faq)}
                  disabled={saving || Boolean(deletingId)}
                  className={BTN_DELETE}
                >
                  {deletingId === faq.id ? 'Silinir…' : 'Sil'}
                </button>
              </div>
            </div>
          </li>
        ))}
        {loading && faqs.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">FAQ-lar yüklənir…</li>
        )}
        {!loading && !error && faqs.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Hələ FAQ yoxdur</li>
        )}
      </ul>
    </section>
  );
}
