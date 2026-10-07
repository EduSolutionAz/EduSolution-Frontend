import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import ImageUploadField from './ImageUploadField';
import { addAd, deleteAd, getAllAds, updateAd } from '../../services/adApi';
import { ADMIN_TOKEN_KEY } from '../../config/api';
import { describeFailure } from '../../services/httpClient';
import { dataUrlToFile, resolveImageFile } from '../../utils/imageFile';
import {
  getAds as getStoredAds,
  removeAd as removeStoredAd,
  subscribe,
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

const EMPTY_FORM = { title: '', content: '', image: '' };
const STATUS_IDLE = { state: 'idle', message: '' };

/**
 * Backend reklamlarını lokal (localStorage) reklamları ilə birləşdirir.
 *
 * `pending: true` — reklam yalnız bu brauzerdə mövcuddur. Bu, ana səhifədə
 * reklam göründüyü halda admin panelində "Hələ reklam yoxdur" yazması
 * problemini həll edir: admin hər ikisini görür və bir tıkla backend-ə
 * göndərir.
 */
function mergeAds(remote, stored) {
  const byTitle = new Map();

  (remote || []).forEach((ad) => {
    const title = typeof ad?.title === 'string' ? ad.title.trim() : '';
    if (!title) return;
    byTitle.set(title, {
      key: title,
      title,
      content: ad.content || '',
      photoUrl: ad.photoUrl || '',
      pending: false,
      storedId: null,
    });
  });

  (stored || []).forEach((ad) => {
    const title = typeof ad?.alt === 'string' ? ad.alt.trim() : '';
    if (!title || byTitle.has(title)) return;
    byTitle.set(title, {
      key: `local:${ad.id}`,
      title,
      // Lokal reklamda ayrıca mətn yoxdur; keçid linki mətn yerinə saxlanılır.
      content: ad.linkUrl || '',
      photoUrl: ad.imageFile || ad.imageUrl || '',
      pending: true,
      storedId: ad.id,
    });
  });

  return [...byTitle.values()];
}

export default function AdBoardManager() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(STATUS_IDLE);
  const [busyId, setBusyId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const storedAds = useSyncExternalStore(subscribe, getStoredAds, getStoredAds);
  const [remoteAds, setRemoteAds] = useState([]);
  const pendingCount = ads.filter((ad) => ad.pending).length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRemoteAds(await getAllAds({ tokenKey: ADMIN_TOKEN_KEY }));
      setStatus(STATUS_IDLE);
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Reklamlar yüklənmədi') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Ucaq siyahı hər iki mənbə dəyişəndə yenidən qurulur ki, yeni və ya
  // silinmiş lokal reklam dərhal siyahıda görünsün.
  useEffect(() => {
    setAds(mergeAds(remoteAds, storedAds));
  }, [remoteAds, storedAds]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(STATUS_IDLE);
  };

  const handleEdit = (ad) => {
    setEditing(ad);
    setForm({ title: ad.title, content: ad.content, image: ad.photoUrl });
    setStatus(STATUS_IDLE);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setStatus({ state: 'loading', message: '' });

    try {
      // AdAddRequestDTO.image `format: binary` olduğu üçün seçilmiş şəkil
      // yenidən File-ə çevrilir; toxunulmayan sahə mövcud URL-i saxlayır.
      const { file } = await resolveImageFile(form.image, 'ad');
      const payload = {
        title: form.title.trim(),
        content: form.content.trim() || form.title.trim(),
        image: file || form.image || undefined,
      };

      const data = editing
        ? await updateAd(payload, { tokenKey: ADMIN_TOKEN_KEY })
        : await addAd(payload, { tokenKey: ADMIN_TOKEN_KEY });

      if (data && (editing ? data.is_updated === false : data.is_created === false)) {
        setStatus({
          state: 'error',
          message: editing ? 'Reklam yenilənmədi' : 'Reklam yaradıla bilmədi',
        });
        return;
      }

      resetForm();
      await load();
    } catch (error) {
      setStatus({
        state: 'error',
        message: describeFailure(
          error,
          editing ? 'Reklam yenilənmədi' : 'Reklam yaradıla bilmədi',
        ),
      });
    }
  };

  /**
   * Lokal reklamları backend-ə göndərir. Lokal şəkil data URL formatında
   * saxlanılır, AdAddRequestDTO isə fayl istəyir, ona görə File-ə çevrilir.
   */
  const handleSync = async () => {
    const pending = ads.filter((ad) => ad.pending);
    if (pending.length === 0) return;

    setSyncing(true);
    setStatus({ state: 'loading', message: `${pending.length} reklam göndərilir...` });

    const failed = [];
    for (const ad of pending) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const file = await dataUrlToFile(ad.photoUrl, 'ad');
        // eslint-disable-next-line no-await-in-loop
        const data = await addAd(
          { title: ad.title, content: ad.content || ad.title, image: file || undefined },
          { tokenKey: ADMIN_TOKEN_KEY },
        );
        if (data && data.is_created === false) failed.push(ad.title);
      } catch {
        failed.push(ad.title);
      }
    }

    setSyncing(false);
    await load();

    if (failed.length === 0) {
      setStatus({ state: 'success', message: `${pending.length} reklam backend-ə göndərildi.` });
      return;
    }

    setStatus({
      state: 'error',
      message: `Göndərilmədi: ${failed.join(', ')} (başlıq artıq mövcuddur ola bilər).`,
    });
  };

  const handleDelete = async (ad) => {
    if (!window.confirm(`"${ad.title}" silinsin?`)) return;

    setBusyId(ad.key);
    setStatus(STATUS_IDLE);
    try {
      if (ad.pending) {
        removeStoredAd(ad.storedId);
      } else {
        const data = await deleteAd(ad.title, { tokenKey: ADMIN_TOKEN_KEY });
        if (data && data.is_deleted === false) {
          setStatus({ state: 'error', message: 'Reklam silinmədi' });
          return;
        }
      }
      await load();
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Reklam silinmədi') });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className={SECTION_TITLE}>Reklam Lövhəsi</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="px-4 py-2 text-[12px] text-[#080d4a] hover:bg-[#f0f4f8] rounded-full transition disabled:opacity-50"
          >
            {loading ? 'Yüklənir...' : 'Yenilə'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (showForm) resetForm();
              else {
                resetForm();
                setShowForm(true);
              }
            }}
            className={BTN_ACCENT}
          >
            {showForm ? 'İmtina' : 'Əlavə et'}
          </button>
        </div>
      </div>

      {status.message && (
        <p
          role="status"
          className={`text-[12px] ${
            status.state === 'error'
              ? 'text-red-600'
              : status.state === 'success'
                ? 'text-[#1a8a99]'
                : 'text-[#323643]/60'
          }`}
        >
          {status.message}
        </p>
      )}

      {pendingCount > 0 && (
        <div className="text-[12px] text-[#a06a00] bg-[#fff4dc] rounded px-3 py-2.5 flex flex-wrap items-center gap-3">
          <span>
            <strong>{pendingCount}</strong> reklam hələ yalnız bu brauzerdə (lokal) var və
            backend-də yoxdur — ana səhifədə görünürlər, lakin{' '}
            <code className="text-[#080d4a]">GET /ad/all</code> onları qaytarmır.
          </span>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="px-3 py-1 rounded-full bg-[#a06a00] text-white text-[11px] font-medium hover:bg-[#b87a00] transition disabled:opacity-60"
          >
            {syncing ? 'Göndərilir...' : 'Backend-ə göndər'}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="ad-title">
              Başlıq *
            </label>
            <input
              id="ad-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Universitetə qəbul"
              className={FIELD_INPUT}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={FIELD_LABEL} htmlFor="ad-content">
              Mətn
            </label>
            <textarea
              id="ad-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={3}
              placeholder="Reklam mətni"
              className={FIELD_TEXTAREA}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Şəkil fayl"
              value={form.image}
              onChange={(value) => setForm((prev) => ({ ...prev, image: value }))}
              maxSize={900}
              hint="Yeni fayl seçilməsə mövcud şəkil saxlanılır"
              previewClass="w-full h-[90px] object-contain"
              previewWrapper="w-full h-[90px]"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="px-4 py-1.5 text-[12px]">
              Ləğv et
            </button>
            <button type="submit" disabled={status.state === 'loading'} className={BTN_PRIMARY}>
              {status.state === 'loading' ? 'Göndərilir...' : editing ? 'Yenilə' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3" role="list">
        {ads.map((ad) => (
          <li
            key={ad.key}
            className="bg-white rounded-md shadow px-4 py-3 flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              {ad.photoUrl && (
                <img
                  src={ad.photoUrl}
                  alt=""
                  className="w-16 h-10 object-cover rounded shrink-0"
                  onError={(e) => {
                    e.target.style.visibility = 'hidden';
                  }}
                />
              )}
              <div className="min-w-0">
                <span className="text-[#080d4a] font-semibold text-[13px] block truncate">
                  {ad.title}
                </span>
                {ad.content && (
                  <span className="text-[#323643]/50 text-[11px] block truncate">{ad.content}</span>
                )}
                <a
                  href={`/reklam/${encodeURIComponent(ad.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#323643]/50 text-[11px] underline block truncate"
                >
                  /reklam/{ad.title}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {ad.pending ? (
                <span className="px-2 py-0.5 rounded-full bg-[#fff4dc] text-[#a06a00] text-[10px] font-medium">
                  lokal
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEdit(ad)}
                  className="px-3 py-1 text-[12px] text-[#080d4a] bg-[#e8eef7] rounded transition hover:bg-[#dbe4f2]"
                >
                  Redaktə
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(ad)}
                disabled={busyId === ad.key}
                className={BTN_DELETE}
              >
                Sil
              </button>
            </div>
          </li>
        ))}

        {loading && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Yüklənir...</li>
        )}
        {!loading && ads.length === 0 && (
          <li className="text-center py-8 text-[#323643]/50 text-[13px]">Hələ reklam yoxdur</li>
        )}
      </ul>
    </section>
  );
}
