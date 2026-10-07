import { ADMIN_TOKEN_KEY } from '../config/api';
import { request } from './httpClient';

const FIELDS = [
  'students_helped',
  'admissions_sent',
  'successful_admission',
  'visa_help',
  'successful_visa_help',
];

/** The five editable counters, always present and numeric. */
function normalizeProperties(dto) {
  const source = dto || {};
  const value = {};

  FIELDS.forEach((field) => {
    const parsed = Number(source[field]);
    value[field] = Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
  });

  // visa_success_rate is computed by the backend from visa_help and
  // successful_visa_help, so it is read-only here.
  const rate = Number(source.visa_success_rate);
  value.visa_success_rate = Number.isFinite(rate) ? rate : null;

  return value;
}

/**
 * GET /property/all -> WebPropertiesResponseDTO. Public.
 *
 * Answers 400 WEB_PROPERTY_NOT_FOUND while no row has been created yet, so a
 * missing row is reported as null instead of an error and the caller can fall
 * back to its static numbers.
 */
export async function getWebProperties() {
  try {
    const { data } = await request('/property/all', { auth: false });
    return data ? normalizeProperties(data) : null;
  } catch (error) {
    if (error?.status === 400) return null;
    throw error;
  }
}

/** POST /property/add -> 201 { is_created, errors }. Admin token. */
export async function addWebProperties(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const body = {};

  FIELDS.forEach((field) => {
    const parsed = Number(payload?.[field]);
    body[field] = Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
  });

  const { data } = await request('/property/add', {
    method: 'POST',
    tokenKey,
    body,
  });
  return data;
}

export { FIELDS as WEB_PROPERTY_FIELDS };
