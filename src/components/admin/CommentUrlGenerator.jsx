import { useState, useSyncExternalStore } from 'react';
import {
  getComments,
  generateCommentUrl,
  getCountries,
  removeComment,
  subscribe,
} from '../../store/adminStore';

export default function CommentUrlGenerator() {
  const comments = useSyncExternalStore(subscribe, getComments, getComments);
  const countries = useSyncExternalStore(subscribe, getCountries, getCountries);
  const [text, setText] = useState('');
  const [countrySlug, setCountrySlug] = useState('');
  const [generated, setGenerated] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    const result = generateCommentUrl(text.trim(), countrySlug);
    setGenerated(result);
    setText('');
    setCountrySlug('');
  };

  const handleDelete = (id) => {
    if (window.confirm('URL-i arxivdən silmək istəyirsiz?')) {
      removeComment(id);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL kopyilədi!');
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-[#080d4a] font-heading font-bold text-[24px] sm:text-[28px]">
        Şərhlək URL Generatoru
      </h2>

      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
      >
        <div className="sm:col-span-2">
          <label className="block text-[11px] text-[#323643]/70 mb-1">
            Şərh mətni (ixtiyəri)
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bu sitə çox faydalı oldu..."
            className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
          />
        </div>
        <div>
          <label className="block text-[11px] text-[#323643]/70 mb-1">
            Ölkə (ixtiyəri)
          </label>
          <select
            value={countrySlug}
            onChange={(e) => setCountrySlug(e.target.value)}
            className="w-full h-[42px] bg-[#f6eeee] rounded px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#26aec4]"
          >
            <option value="">Seçilməyib</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-[#080d4a] text-white font-accent font-semibold rounded-full hover:bg-[#141c63] transition text-[13px]"
          >
            URL Yarat
          </button>
        </div>
      </form>

      {generated && (
        <div className="bg-[#d6eef2] rounded-lg p-4 flex items-center justify-between">
          <div className="break-all text-[13px] text-[#1f2a5a]">
            <span className="font-semibold">Link:</span> {generated.url}
          </div>
          <button
            onClick={() => copyToClipboard(generated.url)}
            className="ml-4 shrink-0 px-4 py-1.5 bg-[#26aec4] text-[#080d4a] font-accent font-semibold rounded-full hover:bg-[#3cc3d8] transition text-[12px]"
          >
            Kopyila
          </button>
        </div>
      )}

      <ul className="space-y-2" role="list">
        {comments.map((c) => (
          <li
            key={c.id}
            className="bg-white rounded-md shadow px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#26aec4] text-[13px] hover:underline break-all block"
              >
                {c.url}
              </a>
              {c.text && (
                <p className="text-[#323643]/60 text-[11px] mt-1 line-clamp-1">
                  "{c.text}"
                </p>
              )}
              {c.countrySlug && (
                <span className="text-[#323643]/40 text-[10px]">
                  Ölkə: {c.countrySlug}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-[#323643]/40">
                {new Date(c.createdAt).toLocaleString('az-AZ')}
              </span>
              <button
                onClick={() => copyToClipboard(c.url)}
                className="px-2 py-1 text-[#26aec4] text-[11px] hover:bg-[#26aec4]/10 rounded transition"
              >
                Kopy
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-2 py-1 text-red-600 text-[11px] hover:bg-red-50 rounded transition"
              >
                Sil
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">
            Hələ heç bir URL yaradılmayıb
          </li>
        )}
      </ul>
    </section>
  );
}
