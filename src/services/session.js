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
 */
export function canAccessAdmin() {
  if (readFlag(ADMIN_VERIFIED_KEY) === '1') return true;
  if (!readToken(ADMIN_TOKEN_KEY)) return false;

  markAdminVerified();
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

export function clearUserToken() {
  writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, null);
}
