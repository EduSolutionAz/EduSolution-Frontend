import {
  ADMIN_TOKEN_KEY,
  ADMIN_TOKEN_TTL_KEY,
  USER_TOKEN_KEY,
  USER_TOKEN_TTL_KEY,
} from '../config/api';
import { readToken, writeToken } from './httpClient';

const ADMIN_VERIFIED_KEY = 'eduSoliton_admin_verified';

function readFlag(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeFlag(key, value) {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

/**
 * Expiry timestamp for a token, or null when the backend did not send
 * `expires_in` (LoginResponse and AdminLogResponse both mark it optional).
 */
export function getTokenExpiry(ttlKey) {
  const raw = readToken(ttlKey);
  if (raw === null) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function isTokenExpired(ttlKey) {
  const expiresAt = getTokenExpiry(ttlKey);
  if (expiresAt === null) return false;
  return Date.now() >= expiresAt;
}

/**
 * The admin area checks access once per browser session, then trusts the
 * result. Re-checking on every render used to bounce a signed-in admin back
 * to the login screen mid-task.
 *
 * The remembered flag is only honoured while a token still exists: a flag
 * left over from a cleared token would otherwise let the admin in while
 * every request went out unauthenticated and got 401.
 */
export function canAccessAdmin() {
  const hasToken = Boolean(readToken(ADMIN_TOKEN_KEY));

  if (!hasToken) {
    writeFlag(ADMIN_VERIFIED_KEY, null);
    return false;
  }

  if (readFlag(ADMIN_VERIFIED_KEY) !== '1') markAdminVerified();
  return true;
}

export function markAdminVerified() {
  writeFlag(ADMIN_VERIFIED_KEY, '1');
}

export function isAdminAuthenticated() {
  return Boolean(readToken(ADMIN_TOKEN_KEY)) && !isTokenExpired(ADMIN_TOKEN_TTL_KEY);
}

export function isUserAuthenticated() {
  return Boolean(readToken(USER_TOKEN_KEY)) && !isTokenExpired(USER_TOKEN_TTL_KEY);
}

export function clearAdminToken() {
  writeToken(ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, null);
  writeFlag(ADMIN_VERIFIED_KEY, null);
}

/**
 * Called when the backend rejects a write. Drops the stale session so the
 * guard stops treating it as valid and the admin is asked to sign in again,
 * instead of failing every request while the panel still looks open.
 */
export function handleAuthFailure() {
  clearAdminToken();
}

export function isAuthFailure(error) {
  return error?.status === 401 || error?.status === 403;
}

export function clearUserToken() {
  writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, null);
}
