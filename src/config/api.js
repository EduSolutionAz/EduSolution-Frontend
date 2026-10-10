const env = import.meta.env || {};

const REMOTE_API_BASE_URL =
  env.VITE_API_BASE_URL || 'https://www.api.edusolution.az/api/v1';

// In dev the backend sends no CORS headers, so requests go through the Vite
// proxy and look same-origin. In production the real URL is used directly and
// the backend must allow the deployed origin.
export const API_BASE_URL = env.DEV ? '/api/v1' : REMOTE_API_BASE_URL;

export const USE_MOCK = env.VITE_USE_MOCK === 'true';

export const API_TIMEOUT_MS = Number(env.VITE_API_TIMEOUT_MS) || 45000;

export const USER_TOKEN_KEY = 'eduSoliton_user_token';
export const ADMIN_TOKEN_KEY = 'eduSoliton_admin_token';

export const USER_TOKEN_TTL_KEY = 'eduSoliton_user_token_expires';
export const ADMIN_TOKEN_TTL_KEY = 'eduSoliton_admin_token_expires';
