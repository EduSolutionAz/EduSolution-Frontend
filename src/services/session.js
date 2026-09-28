import { ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY } from '../config/api';
import { readToken, writeToken } from './httpClient';

export function isTokenExpired(ttlKey) {
  const expiresAt = Number(readToken(ttlKey));
  if (!Number.isFinite(expiresAt) || expiresAt <= 0) return true;
  return Date.now() >= expiresAt;
}

export function isAdminAuthenticated() {
  return Boolean(readToken(ADMIN_TOKEN_KEY)) && !isTokenExpired(ADMIN_TOKEN_TTL_KEY);
}

export function isUserAuthenticated() {
  return Boolean(readToken('eduSoliton_user_token'));
}

export function clearAdminToken() {
  writeToken(ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, null);
}

export function clearUserToken() {
  writeToken('eduSoliton_user_token', 'eduSoliton_user_token_expires', null);
}
