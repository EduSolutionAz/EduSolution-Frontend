import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../config/api';
import { asArray, request } from './httpClient';

const EMPTY_AD = { title: '', content: '', photoUrl: '' };

function mapAd(dto) {
  const title = typeof dto?.title === 'string' ? dto.title.trim() : '';
  if (!title) return null;

  return {
    id: title,
    title,
    content: typeof dto?.content === 'string' ? dto.content : '',
    photoUrl: typeof dto?.photo_url === 'string' ? dto.photo_url : '',
  };
}

/**
 * GET /ad/all -> [{ title, photo_url }]. Requires authentication (401
 * without a token), so the public home page has to degrade gracefully.
 */
export async function getAllAds({ tokenKey = USER_TOKEN_KEY } = {}) {
  const { data } = await request('/ad/all', { tokenKey });
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
function adRequestPayload({ title, content, image }) {
  const trimmedTitle = (title || '').trim();
  const trimmedContent = (content || '').trim();

  const formData = new FormData();
  formData.append('title', trimmedTitle);
  formData.append('content', trimmedContent);
  if (image) formData.append('image', image);

  return {
    formData,
    query: { title: trimmedTitle, content: trimmedContent },
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
