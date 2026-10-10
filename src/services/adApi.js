import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../config/api';
import { asArray, request } from './httpClient';

const EMPTY_AD = { title: '', content: '', link: '', photoUrl: '' };

/**
 * Backend ad content uses the literal two-character sequence `\n` for line
 * breaks. HTML rendering collapses plain newlines too, so the literal
 * sequence is converted to a real newline here and rendered with
 * `whitespace-pre-line` on the display side.
 */
function normalizeLineBreaks(value) {
  return String(value ?? '')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n');
}

function mapAd(dto) {
  const title = typeof dto?.title === 'string' ? dto.title.trim() : '';
  if (!title) return null;

  return {
    id: title,
    title,
    content: normalizeLineBreaks(dto?.content),
    link: typeof dto?.link === 'string' ? dto.link.trim() : '',
    photoUrl: typeof dto?.photo_url === 'string' ? dto.photo_url : '',
  };
}

/**
 * GET /ad/all -> [{ title, photo_url }]. Public endpoint.
 *
 * The home page calls it without auth (no Authorization header). The admin
 * panel passes its own token so the same loader serves both callers.
 */
export async function getAllAds({ tokenKey = USER_TOKEN_KEY, auth = true } = {}) {
  const { data } = await request('/ad/all', { tokenKey, auth });
  return asArray(data).map(mapAd).filter(Boolean);
}

/** GET /ad/info/{adTitle} -> { title, content, photo_url }. Public. */
export async function getAdInfo(adTitle, { auth = true } = {}) {
  if (!adTitle) return null;

  try {
    const { data } = await request(`/ad/info/${encodeURIComponent(adTitle)}`, { auth });
    return mapAd(data) || EMPTY_AD;
  } catch {
    // AD_NOT_FOUND (400) and UNAUTHORIZED (401) both mean "no ad to show",
    // and the caller renders its own fallback.
    return null;
  }
}

/**
 * POST /ad/add -> { title, is_created }. Admin token.
 *
 * The OpenAPI spec documents AdAddRequestDTO as a *query* parameter while the
 * image is declared `format: binary`, so the same values are sent both ways:
 * Spring binds a @ModelAttribute argument from the query string and from the
 * multipart parts, which makes the call work for either mapping.
 */
function adRequestPayload({ title, content, link, image }) {
  const trimmedTitle = (title || '').trim();
  const trimmedContent = (content || '').trim();
  const trimmedLink = (link || '').trim();

  const formData = new FormData();
  formData.append('title', trimmedTitle);
  formData.append('content', trimmedContent);
  formData.append('link', trimmedLink);
  if (image) formData.append('image', image);

  return {
    formData,
    query: { title: trimmedTitle, content: trimmedContent, link: trimmedLink },
  };
}

/** POST /ad/add. Admin token. */
export async function addAd(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { formData, query } = adRequestPayload(payload);
  const { data } = await request('/ad/add', {
    method: 'POST',
    tokenKey,
    formData,
    query,
  });
  return data;
}

/** PATCH /ad/update. Admin token. Takes the same body as /ad/add. */
export async function updateAd(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { formData, query } = adRequestPayload(payload);
  const { data } = await request('/ad/update', {
    method: 'PATCH',
    tokenKey,
    formData,
    query,
  });
  return data;
}

/** DELETE /ad/delete/{adTitle} -> { title, is_deleted }. Admin token. */
export async function deleteAd(adTitle, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request(`/ad/delete/${encodeURIComponent(adTitle)}`, {
    method: 'DELETE',
    tokenKey,
  });
  return data;
}
