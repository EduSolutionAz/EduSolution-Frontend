import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../config/api';
import { asArray, request } from './httpClient';

const BROWSER_ID_KEY = 'eduSoliton_spin_browser_id';

/**
 * PrizeAddRequestDTO.prize_weight opsiyoneldir, ona görə admin formunda
 * weight sorusu yoxdur (çəkilər backend tərəfdən idarə olunur).
 * Lakin /spin/play bütün weight-lərin cəmini hesablayıb 0 olduqda
 * "Prize weights are invalid" xətası verir, ona görə yeni nağıl yaradılarkən
 * bu başlanğıc dəyər göndərilir.
 */
export const DEFAULT_PRIZE_WEIGHT = 10;

/**
 * The spin endpoints identify a player by a UUID in the path
 * (POST /spin/play/{browserId}) and in the body (POST /spin/check,
 * POST /spin/send). A fresh id on every page load would make
 * /spin/check treat the visitor as a new player, so the id is persisted.
 */
export function getBrowserId() {
  try {
    const stored = localStorage.getItem(BROWSER_ID_KEY);
    if (stored) return stored;

    const created =
      globalThis.crypto?.randomUUID?.().toLowerCase() ??
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    localStorage.setItem(BROWSER_ID_KEY, created);
    return created;
  } catch {
    return '00000000-0000-4000-8000-000000000000';
  }
}

/** GET /spin/prizes -> [{ prize_name, prize_weight }]. Public. */
export async function getPrizes() {
  const { data } = await request('/spin/prizes', { auth: false });
  return asArray(data);
}

/**
 * GET /spin/winners -> [{ email, prize_id, prize }]. Auth required.
 *
 * The endpoint is behind Spring Security's `authenticated()` rule and does not
 * care *which* role, so an admin-only panel has to try the admin token first
 * and fall back to the user token. A visitor with neither token gets an empty
 * list instead of an error.
 */
export async function getWinners({ tokenKey = ADMIN_TOKEN_KEY, fallbackTokenKey = USER_TOKEN_KEY } = {}) {
  const tryToken = async (key) => {
    const { data } = await request('/spin/winners', { tokenKey: key });
    return asArray(data);
  };

  try {
    return asArray(await tryToken(tokenKey));
  } catch (error) {
    const unauthorized = error?.status === 401 || error?.status === 403;
    if (!unauthorized || !fallbackTokenKey || fallbackTokenKey === tokenKey) throw error;

    try {
      return asArray(await tryToken(fallbackTokenKey));
    } catch {
      return [];
    }
  }
}

/**
 * POST /spin/check -> { can_play }. Public.
 *
 * `ip` is optional in SpinCheckRequestDTO; when the client cannot determine a
 * public address it is omitted rather than sent empty, because an empty value
 * is not the same as "not supplied" for the server-side duplicate check.
 */
export async function checkCanPlay({ browserId, ip } = {}) {
  const body = { browser_id: browserId || getBrowserId() };
  if (ip) body.ip = ip;

  const { data } = await request('/spin/check', {
    method: 'POST',
    auth: false,
    body,
  });
  return Boolean(data?.can_play);
}

/** POST /spin/play/{browserId} -> { prize }. Public. */
export async function playSpin(browserId) {
  const id = browserId || getBrowserId();
  const { data } = await request(`/spin/play/${encodeURIComponent(id)}`, {
    method: 'POST',
    auth: false,
  });
  return typeof data?.prize === 'string' ? data.prize.trim() : '';
}

/** POST /spin/send -> { is_sent }. Sends the won prize to an e-mail. Public. */
export async function sendPrize({ browserId, email } = {}) {
  const { data } = await request('/spin/send', {
    method: 'POST',
    auth: false,
    body: { browser_id: browserId || getBrowserId(), email },
  });
  return Boolean(data?.is_sent);
}

/**
 * POST /spin/add_prize -> { prize_name, is_created, errors }. Admin token.
 *
 * prize_name məcburidir, prize_weight opsiyoneldir. weight göndərilməsə
 * nağıl 0-a düşür və /spin/play işə düşmür, ona görə DEFAULT_PRIZE_WEIGHT
 * istifadə olunur (weight sonradan backend-də dəyişmək olar).
 */
export async function addPrize({ prizeName, prizeWeight }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/spin/add_prize', {
    method: 'POST',
    tokenKey,
    body: {
      prize_name: prizeName,
      prize_weight: Number.isFinite(Number(prizeWeight)) ? Number(prizeWeight) : DEFAULT_PRIZE_WEIGHT,
    },
  });
  return data;
}

/**
 * PATCH /spin/update -> array of { prize_name, prize_weight }. Admin token.
 * The body is a JSON array, not a single object.
 */
export async function updatePrizes(items, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const payload = (Array.isArray(items) ? items : []).map((item) => ({
    prize_name: item.prizeName ?? item.prize_name,
    prize_weight: Number(item.prizeWeight ?? item.prize_weight),
  }));

  const { data } = await request('/spin/update', {
    method: 'PATCH',
    tokenKey,
    body: payload,
  });
  return asArray(data);
}

/** DELETE /spin/delete_prize/{prizeName} -> { prize_name, is_deleted }. */
export async function deletePrize(prizeName, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request(`/spin/delete_prize/${encodeURIComponent(prizeName)}`, {
    method: 'DELETE',
    tokenKey,
  });
  return data;
}
