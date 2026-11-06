import { ADMIN_TOKEN_KEY } from '../config/api';
import { request } from './httpClient';

const FIELDS = [
  'students_helped',
  'admissions_sent',
  'successful_admission',
  'visa_help',
  'successful_visa_help',
];

const FIELD_ALIASES = {
  students_helped: [
    'students_helped',
    'studentsHelped',
    'student_helped',
    'studentHelped',
    'total_students_helped',
    'totalStudentsHelped',
  ],
  admissions_sent: ['admissions_sent', 'admissionsSent'],
  successful_admission: ['successful_admission', 'successfulAdmission'],
  visa_help: ['visa_help', 'visaHelp'],
  successful_visa_help: ['successful_visa_help', 'successfulVisaHelp'],
  visa_success_rate: [
    'visa_success_rate',
    'visaSuccessRate',
    'visa_success',
    'visaSuccess',
    'success_rate',
    'successRate',
    'visa_rate',
    'visaRate',
    'visa_success_percentage',
    'visaSuccessPercentage',
    'visa_success_rate_percent',
  ],
};

function firstValue(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

/** Backend responses are sometimes wrapped (data/properties) or an array. */
function unwrapProperties(dto) {
  let source = dto;
  if (Array.isArray(source)) source = source[0];
  if (!source || typeof source !== 'object') return {};

  const nested =
    source.data ??
    source.properties ??
    source.web_properties ??
    source.webProperties ??
    source.property;
  if (nested && typeof nested === 'object') {
    source = Array.isArray(nested) ? nested[0] : nested;
  }
  return source && typeof source === 'object' ? source : {};
}

/** "1,250" / "1250" / 1250 -> 1250. */
function toCount(value) {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
}

/** "87" / "87%" / 87 -> 87. */
function toRate(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

/** The five editable counters, always present and numeric. */
function normalizeProperties(dto) {
  const source = unwrapProperties(dto);
  const value = {};
  let foundAny = false;

  FIELDS.forEach((field) => {
    const raw = firstValue(source, FIELD_ALIASES[field]);
    if (raw !== undefined) foundAny = true;
    value[field] = toCount(raw);
  });

  // visa_success_rate is computed by the backend from visa_help and
  // successful_visa_help, so it is read-only here.
  const rateRaw = firstValue(source, FIELD_ALIASES.visa_success_rate);
  if (rateRaw !== undefined) foundAny = true;
  value.visa_success_rate = toRate(rateRaw);

  // Last resort: derive the rate from the two visa counters. The backend
  // normally sends visa_success_rate already computed.
  if (value.visa_success_rate === null && value.visa_help > 0) {
    value.visa_success_rate = Math.round(
      (value.successful_visa_help / value.visa_help) * 100,
    );
  }

  return foundAny ? value : null;
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
