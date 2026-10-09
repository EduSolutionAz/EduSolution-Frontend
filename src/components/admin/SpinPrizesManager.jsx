import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { addPrize, deletePrize, getPrizes, getWinners } from '../../services/spinApi';
import {
  getPrizes as getStoredPrizes,
  removePrize as removeStoredPrize,
  subscribe,
} from '../../store/adminStore';
import { describeFailure } from '../../services/httpClient';
import {
  BTN_ACCENT,
  BTN_DELETE,
  BTN_PRIMARY,
  CARD,
  FIELD_INPUT,
  FIELD_LABEL,
  SECTION_TITLE,
} from './fields';

const EMPTY_FORM = { prizeName: '', prizeWeight: '' };
const STATUS_IDLE = { state: 'idle', message: '' };

/** SpinWinnersDTO -> [{ id, email, prizeId, prize }]. */
function mapWinner(dto, index) {
  const email = typeof dto?.email === 'string' ? dto.email.trim() : '';
  const prize = typeof dto?.prize === 'string' ? dto.prize.trim() : '';
  if (!email && !prize) return null;

  // prize_id bəzən null qaytarır, ona görə açar kimi fallback yaradılır.
  const prizeId = typeof dto?.prize_id === 'string' ? dto.prize_id.trim() : '';

  return { id: prizeId || `${email}-${index}`, email, prizeId, prize };
}

/**
 * Backend siyahısı ilə lokal (localStorage) siyahını birləşdirir.
 *
 * `pending: true` — yalnız lokalda mövcuddur, hələ backend-ə göndərilməyib.
 * Bu, çarkda görünən nağılın admin siyahısında yox görünməsi problemini
 * həll edir: admin hər ikisini görür və lazım gələndə bir tıkla göndərir.
 */
function mergePrizes(remote, stored) {
  const byName = new Map();

  (remote || []).forEach((prize) => {
    const name = typeof prize?.prize_name === 'string' ? prize.prize_name.trim() : '';
    if (!name) return;
    byName.set(name, {
      key: name,
      name,
      weight: Number(prize.prize_weight) || 0,
      pending: false,
      storedId: null,
    });
  });

  (stored || []).forEach((prize) => {
    const name = typeof prize?.name === 'string' ? prize.name.trim() : '';
    if (!name || byName.has(name)) return;
    byName.set(name, { key: `local:${name}`, name, weight: null, pending: true, storedId: prize.id });
  });

  return [...byName.values()];
}

export default function SpinPrizesManager() {
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(STATUS_IDLE);
  const [busyId, setBusyId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Lokal siyahı admin panelinin öz store-udur; yeni məlumat yarandıqda
  // useSyncExternalStore bu komponenti yenidən render edir.
  const storedPrizes = useSyncExternalStore(subscribe, getStoredPrizes, getStoredPrizes);

  const [remotePrizes, setRemotePrizes] = useState([]);
  const pendingCount = prizes.filter((prize) => prize.pending).length;

  const loadPrizes = useCallback(async () => {
    setLoading(true);
    try {
      setRemotePrizes(await getPrizes());
      setStatus(STATUS_IDLE);
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Nağıllar yüklənmədi') });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWinners = useCallback(async () => {
    setLoadingWinners(true);
    try {
      const data = await getWinners();
      setWinners(data.map(mapWinner).filter(Boolean));
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Qaliblar yüklənmədi') });
    } finally {
      setLoadingWinners(false);
    }
  }, []);

  useEffect(() => {
    loadPrizes();
  }, [loadPrizes]);

  useEffect(() => {
    loadWinners();
  }, [loadWinners]);

  // Ucaq (lokal + backend) siyahı hər renderda yenidən qurulur ki, yeni bir
  // nağıl əlavə olunanda və ya silindədə siyahı dərhal yenilənsin.
  useEffect(() => {
    setPrizes(mergePrizes(remotePrizes, storedPrizes));
  }, [remotePrizes, storedPrizes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(STATUS_IDLE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.prizeName.trim();
    if (!name) return;

    // Weight optional: empty/blank falls back to the backend default (10).
    // When supplied it must be a positive integer — an empty string would
    // otherwise be parsed as 0 by Number(''), so only send it when valid.
    const rawWeight = String(form.prizeWeight ?? '').trim();
    let prizeWeight;
    if (rawWeight !== '') {
      const parsed = Number(rawWeight);
      if (!Number.isInteger(parsed) || parsed < 1) {
        setStatus({ state: 'error', message: 'Çəki 1-dən az olmayan tam ədəd olmalıdır' });
        return;
      }
      prizeWeight = parsed;
    }

    setStatus({ state: 'loading', message: '' });
    try {
      const data = await addPrize({ prizeName: name, prizeWeight });

      if (data && data.is_created === false) {
        const first = data?.errors?.[0]?.error_message ?? data?.errors?.[0]?.message;
        setStatus({ state: 'error', message: first || 'Nağıl yaradıla bilmədi' });
        return;
      }

      setForm(EMPTY_FORM);
      setShowForm(false);
      await loadPrizes();
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Nağıl yaradıla bilmədi') });
    }
  };

  /** Lokal siyahıdakı nağılları bir tıkla backend-ə göndərir. */
  const handleSync = async () => {
    const pending = prizes.filter((prize) => prize.pending);
    if (pending.length === 0) return;

    setSyncing(true);
    setStatus({ state: 'loading', message: `${pending.length} nağıl göndərilir...` });

    const failed = [];
    for (const prize of pending) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const data = await addPrize({ prizeName: prize.name });
        if (data && data.is_created === false) failed.push(prize.name);
      } catch {
        failed.push(prize.name);
      }
    }

    setSyncing(false);
    await loadPrizes();

    if (failed.length === 0) {
      setStatus({
        state: 'success',
        message: `${pending.length} nağıl backend-ə göndərildi. Çarx artıq işləyir.`,
      });
      return;
    }

    setStatus({
      state: 'error',
      message: `Göndərilmədi: ${failed.join(', ')} (ad artıq mövcuddur ola bilər — Yadda saxla düyməsi ilə yoxlayın).`,
    });
  };

  const handleDelete = async (prize) => {
    if (!window.confirm(`"${prize.name}" silinsin?`)) return;

    setBusyId(prize.key);
    setStatus(STATUS_IDLE);
    try {
      if (prize.pending) {
        removeStoredPrize(prize.storedId);
      } else {
        const data = await deletePrize(prize.name);
        if (data && data.is_deleted === false) {
          setStatus({ state: 'error', message: 'Nağıl silinmədi' });
          return;
        }
      }
      await loadPrizes();
    } catch (error) {
      setStatus({ state: 'error', message: describeFailure(error, 'Nağıl silinmədi') });
    } finally {
      setBusyId(null);
    }
  };

  const copyUuid = async (uuid) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setStatus({ state: 'success', message: 'UUID kopyalandı.' });
    } catch {
      setStatus({ state: 'error', message: 'UUID kopyalanmadı — brauzer icazə vermədi.' });
    }
  };

  return (
    <section className="space-y-8">
      {/* ---------------- Nağıllar ---------------- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className={SECTION_TITLE}>Spin Nağılları</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadPrizes}
              disabled={loading}
              className="px-4 py-2 text-[12px] text-[#080d4a] hover:bg-[#f0f4f8] rounded-full transition disabled:opacity-50"
            >
              {loading ? 'Yüklənir...' : 'Yenilə'}
            </button>
            <button type="button" onClick={() => setShowForm((v) => !v)} className={BTN_ACCENT}>
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

        {/* Lokal siyahıdakı nağılların xəbərdarlığı + tək tıkla göndərmə. */}
        {pendingCount > 0 && (
          <div className="text-[12px] text-[#a06a00] bg-[#fff4dc] rounded px-3 py-2.5 flex flex-wrap items-center gap-3">
            <span>
              <strong>{pendingCount}</strong> nağıl hələ yalnız bu brauzerdə (lokal) var və
              backend-də yoxdur — çark onları görür, ona görə{' '}
              <code className="text-[#080d4a]">GET /spin/play</code> xəta verir.
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
          <form onSubmit={handleSubmit} className={`${CARD} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
            <div className="sm:col-span-2">
              <label className={FIELD_LABEL} htmlFor="prize-name">
                Nağıl adı *
              </label>
              <input
                id="prize-name"
                name="prizeName"
                value={form.prizeName}
                onChange={handleChange}
                placeholder="Məsələn: 10% endirim"
                className={FIELD_INPUT}
                required
              />
            </div>

            <div>
              <label className={FIELD_LABEL} htmlFor="prize-weight">
                Çəki (weight)
              </label>
              <input
                id="prize-weight"
                name="prizeWeight"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={form.prizeWeight}
                onChange={handleChange}
                placeholder="10"
                className={FIELD_INPUT}
              />
              <p className="mt-1 text-[10px] text-[#323643]/45">
                Boş qalsa standart çəki (10) istifadə olunur. Çarxın fırlanma
                şansı çəkiyə görədir.
              </p>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1.5 text-[12px]"
              >
                Ləğv et
              </button>
              <button type="submit" disabled={status.state === 'loading'} className={BTN_PRIMARY}>
                {status.state === 'loading' ? 'Göndərilir...' : 'Əlavə et'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <ul className="space-y-2" role="list">
            {prizes.map((prize) => (
              <li
                key={prize.key}
                className="flex flex-wrap items-center justify-between gap-3 py-2 border-b last:border-0"
              >
                <span className="flex items-center gap-2 text-[#080d4a] text-[14px] font-medium">
                  {prize.name}
                  {prize.pending && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fff4dc] text-[#a06a00] text-[10px] font-medium">
                      lokal · backend-də yoxdur
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#323643]/45">
                    {prize.pending ? 'çəki göndəriləcək' : `çəki: ${prize.weight}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(prize)}
                    disabled={busyId === prize.key}
                    className={BTN_DELETE}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}

            {!loading && prizes.length === 0 && (
              <li className="text-center py-6 text-[#323643]/50 text-[13px]">
                Heç bir nağıl yoxdur
              </li>
            )}
            {loading && (
              <li className="text-center py-6 text-[#323643]/50 text-[13px]">Yüklənir...</li>
            )}
          </ul>
        </div>
      </div>

      {/* ---------------- Qaliblar ---------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className={SECTION_TITLE}>Qaliblar ({winners.length})</h2>
          <button
            type="button"
            onClick={loadWinners}
            disabled={loadingWinners}
            className="px-4 py-2 text-[12px] text-[#080d4a] hover:bg-[#f0f4f8] rounded-full transition disabled:opacity-50"
          >
            {loadingWinners ? 'Yüklənir...' : 'Yenilə'}
          </button>
        </div>

        <p className="text-[#323643]/50 text-[11px] -mt-2">
          Siyahı <code className="text-[#323643]/70">GET /spin/winners</code> endpoint-indən
          gəlir. <code className="text-[#323643]/70">prize_id</code> backend-də qazanmış şəxsin
          UUID identifikatorıdır.
        </p>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6eeee] text-[#323643]/70 text-[11px] uppercase tracking-wide">
                <th className="px-4 py-2.5 font-semibold">#</th>
                <th className="px-4 py-2.5 font-semibold">Email</th>
                <th className="px-4 py-2.5 font-semibold">Mükafat</th>
                <th className="px-4 py-2.5 font-semibold">Prize ID (UUID)</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr key={winner.id} className="border-t border-black/5">
                  <td className="px-4 py-2.5 text-[12px] text-[#323643]/50">{index + 1}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#080d4a] font-medium break-all">
                    {winner.email || '—'}
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[#323643]">{winner.prize || '—'}</td>
                  <td className="px-4 py-2.5">
                    {winner.prizeId ? (
                      <span className="inline-flex items-center gap-2">
                        <code className="text-[11px] text-[#323643]/70 bg-[#f6eeee] rounded px-2 py-1 break-all">
                          {winner.prizeId}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyUuid(winner.prizeId)}
                          aria-label="UUID kopyala"
                          title="UUID kopyala"
                          className="shrink-0 px-2 py-1 text-[11px] text-[#26aec4] hover:bg-[#26aec4]/10 rounded transition"
                        >
                          Kopyala
                        </button>
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#323643]/40">yoxdur</span>
                    )}
                  </td>
                </tr>
              ))}

              {!loadingWinners && winners.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#323643]/50 text-[13px]">
                    Hələ qalib yoxdur
                  </td>
                </tr>
              )}
              {loadingWinners && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#323643]/50 text-[13px]">
                    Yüklənir...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
