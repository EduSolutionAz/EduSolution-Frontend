import { API_BASE_URL, API_TIMEOUT_MS, USE_MOCK } from '../config/api';

export class ApiError extends Error {
  constructor(message, { code, status, errors } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export function readToken(key) {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

export function writeToken(key, ttlKey, token, expiresIn) {
  try {
    if (token) localStorage.setItem(key, token);
    else localStorage.removeItem(key);

    if (expiresIn) {
      localStorage.setItem(ttlKey, String(Date.now() + expiresIn * 1000));
    } else {
      localStorage.removeItem(ttlKey);
    }
  } catch {
    /* storage unavailable */
  }
}

export function toFormData(payload) {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (value instanceof File || value instanceof Blob) formData.append(key, value);
    else formData.append(key, String(value));
  });
  return formData;
}

export function asArray(data) {
  return Array.isArray(data) ? data : [];
}

export function normalizeErrors(errors) {
  if (!Array.isArray(errors)) return [];
  return errors
    .map((item) => {
      if (typeof item === 'string') return { message: item };
      const message = item?.error_message ?? item?.message ?? item?.error;
      return message ? { message } : null;
    })
    .filter(Boolean);
}

function btoa64(value) {
  try {
    return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
  } catch {
    return btoa(unescape(encodeURIComponent(value)));
  }
}

function buildAuthHeader(options) {
  const { tokenKey, basic } = options || {};

  if (basic) return `Basic ${btoa64(basic)}`;

  const token = tokenKey ? readToken(tokenKey) : null;
  if (token) {
    const isBearer = /^[A-Za-z0-9._-]+$/.test(token) && !token.includes(':');
    return token.startsWith('Basic ') ? token : isBearer ? `Bearer ${token}` : `Basic ${token}`;
  }

  return null;
}

async function parseBody(response) {
  const type = response.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  const text = await response.text();
  return text || null;
}

const STATUS_MESSAGES = {
  400: 'Sorğu yanlışdır (400)',
  401: 'Giriş tələb olunur və ya icazə yoxdur (401)',
  403: 'İcazə yoxdur (403)',
  404: 'Tapılmadı (404)',
  409: 'Artıq mövcuddur (409)',
  500: 'Server xətası (500)',
  503: 'Server müvəqqəti işləmir (503)',
};

function toApiError(status, body) {
  const message =
    (body && (body.message || body.detail || body.error)) ||
    STATUS_MESSAGES[status] ||
    `Request failed (${status})`;
  return new ApiError(message, {
    code: body?.code,
    status,
    errors: normalizeErrors(body?.errors),
  });
}

export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    formData,
    query,
    tokenKey,
    basic,
    auth = true,
    signal,
  } = options;

  // API_BASE_URL may be relative (dev proxy) or absolute (production).
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = {};
  if (auth) {
    const authorization = buildAuthHeader({ tokenKey, basic });
    if (authorization) headers.Authorization = authorization;
  }

  const init = { method, headers, signal };
  if (formData) {
    init.body = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  init.signal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;

  let response;
  try {
    response = await fetch(url.toString(), init);
  } catch (error) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      throw new ApiError('Sorğu vaxtında cavab almadı', { code: 'TIMEOUT' });
    }
    throw new ApiError('Serverə qoşulma mümkün olmadı — internet bağlantısı və ya CORS', {
      code: 'NETWORK',
    });
  }
  clearTimeout(timer);

  const parsed = await parseBody(response);

  if (!response.ok) {
    throw toApiError(response.status, parsed);
  }

  if (USE_MOCK) {
    return { data: parsed, mock: true };
  }

  return { data: parsed, status: response.status };
}
