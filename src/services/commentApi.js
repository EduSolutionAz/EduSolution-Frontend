import { createId } from '../utils/id';
import {
  addApplicant,
  addApplicantGeneration,
  findGenerationByTokenHash,
  getApplicants,
  markGenerationUsed,
} from '../store/adminStore';

export const APPLICANT_SERVICES = [
  { value: 'VISA', label: 'Visa Process' },
  { value: 'RESIDENCE_PERMIT', label: 'Residence Permit' },
  { value: 'UNIVERSITY', label: 'University Admission' },
];

export const LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 75,
  COMMENT_MIN: 20,
  COMMENT_MAX: 256,
  TOKEN_LENGTH: 36,
  TOKEN_TTL_HOURS: 2,
  TOP_LIMIT: 5,
};

const MESSAGES = {
  NAME_REQUIRED: 'Name is required to proceed. Name cannot be blank',
  NAME_LENGTH: 'Name must not exceed 100 characters',
  EMAIL_REQUIRED: 'Email is required to proceed',
  EMAIL_LENGTH: 'Email must not exceed 75 characters',
  EMAIL_VALID: 'Email must be a valid email address',
  COMMENT_REQUIRED: 'Comment cannot be blank',
  COMMENT_SIZE: 'Comment cannot be less than 20 characters and more than 256 characters',
  SERVICE_REQUIRED: 'Service type cannot be null',
  TOKEN_LENGTH: 'Token must be exactly 36 characters',
  TOKEN_REQUIRED: 'Token cannot be blank',
  TOKEN_EXPIRED: 'Token has expired, request a new token',
  TOKEN_USED: 'Token is already used',
  TOKEN_NOT_FOUND: 'Token not found',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function errors(...messages) {
  return messages.map((message) => ({ message }));
}

function buildCommentLink(token) {
  return `${window.location.origin}/comment/${token}`;
}

function weakHashHex(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0').repeat(8);
}

async function sha256Hex(value) {
  const encoded = new TextEncoder().encode(value);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  return weakHashHex(value);
}

function randomHex(length) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

function createToken() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().toLowerCase();
  return [
    randomHex(8),
    randomHex(4),
    `4${randomHex(3)}`,
    `${'89ab'[Math.floor(Math.random() * 4)]}${randomHex(3)}`,
    randomHex(12),
  ]
    .join('-')
    .toLowerCase();
}

export function getServiceLabel(value) {
  return APPLICANT_SERVICES.find((item) => item.value === value)?.label ?? value;
}

export function validateGenerateRequest(name, email) {
  const found = [];
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();

  if (!trimmedName) found.push(MESSAGES.NAME_REQUIRED);
  else if (trimmedName.length > LIMITS.NAME_MAX) found.push(MESSAGES.NAME_LENGTH);

  if (!trimmedEmail) found.push(MESSAGES.EMAIL_REQUIRED);
  else if (trimmedEmail.length > LIMITS.EMAIL_MAX) found.push(MESSAGES.EMAIL_LENGTH);
  else if (!EMAIL_RE.test(trimmedEmail)) found.push(MESSAGES.EMAIL_VALID);

  return found;
}

export function validateReviewRequest(token, service, comment) {
  const found = [];
  const trimmedComment = (comment || '').trim();

  if (!token) found.push(MESSAGES.TOKEN_REQUIRED);
  else if (token.length !== LIMITS.TOKEN_LENGTH) found.push(MESSAGES.TOKEN_LENGTH);

  if (!service) found.push(MESSAGES.SERVICE_REQUIRED);

  if (!trimmedComment) found.push(MESSAGES.COMMENT_REQUIRED);
  else if (trimmedComment.length < LIMITS.COMMENT_MIN || trimmedComment.length > LIMITS.COMMENT_MAX) {
    found.push(MESSAGES.COMMENT_SIZE);
  }

  return found;
}

export async function generateCommentLink({ name, email }) {
  const validationErrors = validateGenerateRequest(name, email);
  if (validationErrors.length > 0) {
    return { email: (email || '').trim(), is_sent: false, errors: errors(...validationErrors) };
  }

  const token = createToken();
  const tokenHash = await sha256Hex(token);

  addApplicantGeneration({
    id: createId('gen'),
    tokenHash,
    link: buildCommentLink(token),
    clientName: name.trim(),
    clientEmail: email.trim(),
    expiresAt: new Date(Date.now() + LIMITS.TOKEN_TTL_HOURS * 3600 * 1000).toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  });

  return { email: email.trim(), is_sent: true, errors: [] };
}

export async function sendReview({ token, service, comment }) {
  const validationErrors = validateReviewRequest(token, service, comment);
  if (validationErrors.length > 0) {
    return { email: null, is_comment_accepted: false, errors: errors(...validationErrors) };
  }

  const generation = findGenerationByTokenHash(await sha256Hex(token));
  if (!generation) {
    return { email: null, is_comment_accepted: false, errors: errors(MESSAGES.TOKEN_NOT_FOUND) };
  }

  if (new Date(generation.expiresAt).getTime() < Date.now()) {
    return {
      email: generation.clientEmail,
      is_comment_accepted: false,
      errors: errors(MESSAGES.TOKEN_EXPIRED),
    };
  }

  if (generation.used) {
    return {
      email: generation.clientEmail,
      is_comment_accepted: false,
      errors: errors(MESSAGES.TOKEN_USED),
    };
  }

  addApplicant({
    id: createId('app'),
    applicantName: generation.clientName,
    applicantEmail: generation.clientEmail,
    applicantServiceType: service,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  });
  markGenerationUsed(generation.id, true);

  return { email: generation.clientEmail, is_comment_accepted: true, errors: [] };
}

export async function getTopComments(limit = LIMITS.TOP_LIMIT) {
  return getApplicants()
    .slice(0, limit)
    .map((applicant) => ({
      applicant_name: applicant.applicantName,
      comment: applicant.comment,
      service: applicant.applicantServiceType,
    }));
}
