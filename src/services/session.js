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
 * The admin area requires a stored token. When the backend rejects a
 * request the session is ended and the login page is shown, so entering the
 * panel always requires a sign-in that the backend has accepted.
 */
export function canAccessAdmin() {
  const hasToken = Boolean(readToken(ADMIN_TOKEN_KEY));

  if (!hasToken) {
    writeFlag(ADMIN_VERIFIED_KEY, null);
    return false;
  }

  // Tokenin öz TTL-ü keçibsə panelə girmək olmaz.
  if (isTokenExpired(ADMIN_TOKEN_TTL_KEY)) {
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
 * Ends the admin session and sends the browser to the login page.
 * Used when the backend rejects a request, so a stale token can never leave
 * the panel open with every action failing.
 */
export function endAdminSession() {
  clearAdminToken();
  if (typeof window !== 'undefined') {
    window.location.assign('/admin/login');
  }
}

export function isAuthFailure(error) {
  return error?.status === 401 || error?.status === 403;
}

/** Local guard so a missing token is reported before the request is sent. */
export function hasAdminToken() {
  return Boolean(readToken(ADMIN_TOKEN_KEY));
}

export function clearUserToken() {
  writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, null);
}
