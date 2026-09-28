import { useState, useSyncExternalStore } from 'react';
import { generateCommentLink } from '../../services/commentApi';
import {
  getApplicantGenerations,
  removeGeneration,
  subscribe,
} from '../../store/adminStore';
import {
  BTN_DELETE,
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from './fields';

function statusOf(generation) {
  if (generation.used) return { label: 'İstifadə edildi', className: 'bg-[#26aec4]/15 text-[#1a8a99]' };
  if (new Date(generation.expiresAt).getTime() < Date.now()) {
    return { label: 'Vaxtı bitdi', className: 'bg-red-100 text-red-700' };
  }
  return { label: 'Gözləyir', className: 'bg-amber-100 text-amber-700' };
}

export default function CommentUrlGenerator() {
  const generations = useSyncExternalStore(
    subscribe,
    getApplicantGenerations,
    getApplicantGenerations,
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState([]);
  const [sentLink, setSentLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrors([]);
    setSentLink(null);

    const result = await generateCommentLink({ name, email });

    setIsSending(false);
    if (!result.is_sent) {
      setErrors(result.errors.map((item) => item.message));
      return;
    }

    const link = generations[0]?.link ?? null;
    setSentLink(link);
    setName('');
    setEmail('');
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <section className="space-y-6">
      <h2 className={SECTION_TITLE}>Rəy Linki Göndər</h2>

      <p className="text-[#323643]/60 text-[12px] leading-5 -mt-3">
        Ad və e-poçt daxil edin — sistem şəxsi təsdiqləyici link yaradıb 2 saat ərzində
        müştəqiyyətlə göndərəcək. Həmin linkdə müştəqi rəyini özü yazacaq.
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

      {sentLink && (
        <div className="bg-[#d6eef2] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="break-all text-[13px] text-[#1f2a5a]">
            <span className="font-semibold">Link:</span> {sentLink}
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(sentLink)}
            className="shrink-0 px-4 py-1.5 rounded-full bg-[#26aec4] text-[#080d4a] font-accent font-semibold hover:bg-[#3cc3d8] transition text-[12px]"
          >
            Kopyala
          </button>
        </div>
      )}

      <h3 className="text-[#080d4a] text-[16px] font-semibold">
        Göndərilmiş linklər ({generations.length})
      </h3>

      <ul className="space-y-2" role="list">
        {generations.map((generation) => {
          const status = statusOf(generation);
          return (
            <li key={generation.id} className="bg-white rounded-md shadow px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[#080d4a] text-[13px] font-medium">
                    {generation.clientName}{' '}
                    <span className="text-[#323643]/50 font-normal">
                      · {generation.clientEmail}
                    </span>
                  </p>
                  <p className="text-[#323643]/50 text-[11px] mt-1">
                    {new Date(generation.createdAt).toLocaleString('az-AZ')} · bitmə:{' '}
                    {new Date(generation.expiresAt).toLocaleString('az-AZ')}
                  </p>
                  {!generation.used && (
                    <a
                      href={generation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#26aec4] text-[11px] hover:underline break-all inline-block mt-1"
                    >
                      {generation.link}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}>
                    {status.label}
                  </span>
                  {!generation.used && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generation.link)}
                      className="px-2 py-1 text-[#26aec4] text-[11px] hover:bg-[#26aec4]/10 rounded transition"
                    >
                      Kopyala
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Bu linki silmək istəyirsiniz?')) removeGeneration(generation.id);
                    }}
                    className={BTN_DELETE}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          );
        })}

        {generations.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">
            Hələ link göndərilməyib
          </li>
        )}
      </ul>
    </section>
  );
}
