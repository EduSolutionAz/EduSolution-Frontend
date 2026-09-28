import { ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY } from '../config/api';
import { readToken, writeToken } from './httpClient';
import {
  USER_TOKEN_KEY,
  USER_TOKEN_TTL_KEY,
} from '../config/api';

/**
 * Expiry timestamp for a token, or null when the backend did not send
 * `expires_in` (both LoginResponse and AdminLogResponse mark it optional).
 */
export function getTokenExpiry(ttlKey) {
  const raw = readToken(ttlKey);
  if (raw === null) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Without a recorded expiry the client cannot know when the token dies, so it
 * is treated as valid and the server stays the authority on rejection.
 */
export function isTokenExpired(ttlKey) {
  const expiresAt = getTokenExpiry(ttlKey);
  if (expiresAt === null) return false;
  return Date.now() >= expiresAt;
}

export function isAdminAuthenticated() {
  return Boolean(readToken(ADMIN_TOKEN_KEY)) && !isTokenExpired(ADMIN_TOKEN_TTL_KEY);
}

export function isUserAuthenticated() {
  return Boolean(readToken(USER_TOKEN_KEY)) && !isTokenExpired(USER_TOKEN_TTL_KEY);
}

export function clearAdminToken() {
  writeToken(ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, null);
}

export function clearUserToken() {
  writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, null);
}
