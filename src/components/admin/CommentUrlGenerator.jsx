import { useState } from 'react';
import { generateCommentLink } from '../../services/contentApi';
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
    </section>
  );
}
