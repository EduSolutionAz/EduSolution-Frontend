import { useEffect, useState } from 'react';
import { deleteComment, generateCommentLink, getAllComments } from '../../services/contentApi';
import {
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from './fields';

export default function CommentUrlGenerator() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState([]);
  const [sentTo, setSentTo] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const loadComments = async () => {
    setLoadingComments(true);
    setCommentError('');
    try {
      const data = await getAllComments();
      setComments(
        data
          .map((item) => ({
            name: item?.name || '',
            comment: item?.comment || '',
          }))
          .filter((item) => item.comment),
      );
    } catch (err) {
      setComments([]);
      setCommentError(
        err?.message || 'Rəylər yüklənmədi. Admin tokeni lazımdır.',
      );
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDeleteComment = async (item) => {
    if (!window.confirm(`"${item.name}" tərəfindən yazılan rəy silinsin?`)) return;

    setDeleting(item.name);
    try {
      const result = await deleteComment({ name: item.name, comment: item.comment });
      if (result?.is_deleted) {
        setComments((prev) => prev.filter((c) => c.comment !== item.comment));
      } else {
        setCommentError('Rəy silinmədi.');
      }
    } catch (err) {
      setCommentError(err?.message || 'Rəy silinmədi.');
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrors([]);
    setSentTo(null);

    try {
      const result = await generateCommentLink({ name: name.trim(), email: email.trim() });

      if (result?.is_sent) {
        setSentTo(result.email || email.trim());
        setName('');
        setEmail('');
        return;
      }

      setErrors(
        (result?.errors || []).length > 0
          ? result.errors.map((item) => item.message)
          : ['Link göndərilmədi. Yenidən cəhd edin.'],
      );
    } catch (error) {
      setErrors(
        error?.errors?.length > 0
          ? error.errors.map((item) => item.message)
          : [error?.message || 'Xəta baş verdi.'],
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className={SECTION_TITLE}>Rəy Linki Göndər</h2>

      <p className="text-[#323643]/60 text-[12px] leading-5 -mt-3">
        Ad və e-poçt daxil edin — sistem şəxsi təsdiqləyici link yaradıb e-poçt üçün
        göndərəcək. Müştəqi rəyini həmin linkdə özü yazacaq.
      </p>

      <form onSubmit={handleSubmit} className={`${CARD} space-y-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={FIELD_LABEL} htmlFor="gen-name">Ad *</label>
            <input
              id="gen-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Müştəqinin adı"
              className={FIELD_INPUT}
              required
            />
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="gen-email">E-poçt *</label>
            <input
              id="gen-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={FIELD_INPUT}
              required
            />
          </div>
        </div>

        {errors.length > 0 && (
          <ul className="text-red-600 text-[12px] space-y-1" role="alert">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSending} className={BTN_PRIMARY}>
            {isSending ? 'Göndərilir...' : 'Link yarat və göndər'}
          </button>
        </div>
      </form>

      {sentTo && (
        <div className="bg-[#d6eef2] rounded-lg p-4" role="status">
          <p className="text-[13px] text-[#1f2a5a]">
            <span className="font-semibold">Göndərildi:</span> {sentTo}
          </p>
          <p className="text-[12px] text-[#1f2a5a]/70 mt-1">
            Təsdiqləyici link bu e-poçt ünvanına göndərildi.
          </p>
        </div>
      )}

      <h3 className="text-[#080d4a] text-[16px] font-semibold">
        Rəylər ({comments.length})
      </h3>

      {commentError && (
        <p role="alert" className="text-red-600 text-[12px]">
          {commentError}
        </p>
      )}

      <ul className="space-y-2" role="list">
        {comments.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="bg-white rounded-md shadow px-4 py-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[#080d4a] text-[13px] font-medium truncate">{item.name}</p>
              <p className="text-[#323643]/70 text-[12px] leading-5 mt-1 break-words">
                {item.comment}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteComment(item)}
              disabled={deleting === index}
              className="shrink-0 px-3 py-1 text-red-600 text-[11px] hover:bg-red-50 rounded transition disabled:opacity-50"
            >
              {deleting === index ? 'Silinir...' : 'Sil'}
            </button>
          </li>
        ))}

        {loadingComments && (
          <li className="text-center py-6 text-[#323643]/50 text-[13px]">Yüklənir...</li>
        )}

        {!loadingComments && comments.length === 0 && (
          <li className="text-center py-6 text-[#323643]/50 text-[13px]">
            Hələ rəy yoxdur
          </li>
        )}
      </ul>
    </section>
  );
}
