import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../config/api';
import { asArray, request, toFormData } from './httpClient';
import { mapCountryLogos, mapTopCountry } from './mappers';

export async function getTopCountries() {
  const { data } = await request('/country/top_countries', { auth: false });
  return asArray(data);
}

export async function getCountryLogos() {
  const { data } = await request('/country/country_logos', { auth: false });
  return asArray(data);
}

/**
 * Every country, merged from the capped top list and the logo list.
 * /country/top_countries only returns a handful, /country/country_logos
 * returns one entry per country.
 */
export async function getAllCountries() {
  const [top, logos] = await Promise.all([
    getTopCountries().catch(() => []),
    getCountryLogos().catch(() => []),
  ]);

  const rich = asArray(top).map(mapTopCountry).filter(Boolean);
  const bySlug = new Set(rich.map((country) => country.slug));

  const inferred = Object.keys(mapCountryLogos(logos))
    .filter((slug) => !bySlug.has(slug))
    .map((slug) => ({
      slug,
      name: slug.replace(/-/g, ' '),
      flag: '',
      heroImage: '',
      heroAlt: slug.replace(/-/g, ' '),
      card: { universityCount: 0, tuitionFee: 0, features: [] },
      countryBgUrl: '',
      visaHelp: false,
      dormitoryHelp: false,
      limited: true,
    }));

  return [...rich.map((c) => ({ ...c, limited: false })), ...inferred];
}

export async function getCountry(countryName) {
  const { data } = await request(
    `/country/country_detail/${encodeURIComponent(countryName)}`,
    { auth: false },
  );
  return data;
}

/** All universities, public. Returns [{ university_name, country_name }]. */
export async function getAllUniversities() {
  const { data } = await request('/university/all', { auth: false });
  return asArray(data);
}

/** Universities of one country. Admin token required. */
export async function getUniversitiesByCountry(countryName, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/university/all_by_country', {
    method: 'GET',
    tokenKey,
    body: { countryName },
  });
  return asArray(data);
}

/**
 * Authenticated country details. Not present in the OpenAPI spec: it is
 * missing from swagger, returns 401 without a token, and currently answers
 * 200 with an empty body for any "Bearer" value.
 */
export async function getCountryDetails(countryName, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request(`/country/country_details/${encodeURIComponent(countryName)}`, {
    tokenKey,
  });
  return data;
}

export async function addCountry(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/country/add_country', {
    method: 'POST',
    tokenKey,
    formData: toFormData(payload),
  });
  return data;
}

export async function deleteCountry({ countryName }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/country/delete_country', {
    method: 'DELETE',
    tokenKey,
    body: { country_name: countryName },
  });
  return data;
}

/** Mirrors UpdateCountryRequestDTO: multipart, same fields as add. */
export async function updateCountry(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/country/update', {
    method: 'PATCH',
    tokenKey,
    formData: toFormData(payload),
  });
  return data;
}

export async function getUniversityLogos() {
  const { data } = await request('/university/university_logos', { auth: false });
  return asArray(data);
}

export async function getUniversityDetails(universityName) {
  const { data } = await request(
    `/university/university_details/${encodeURIComponent(universityName)}`,
    { auth: false },
  );
  return data;
}

export async function addUniversity(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/university/add_university', {
    method: 'POST',
    tokenKey,
    formData: toFormData(payload),
  });
  return data;
}

export async function deleteUniversity({ universityName }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/university/delete_university', {
    method: 'DELETE',
    tokenKey,
    body: { university_name: universityName },
  });
  return data;
}

/** Mirrors UpdateUniversityRequestDTO: multipart, fee instead of a fee name. */
export async function updateUniversity(payload, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/university/update', {
    method: 'PATCH',
    tokenKey,
    formData: toFormData(payload),
  });
  return data;
}

/**
 * Full university record for prefilling the edit form.
 * Authenticated and takes the name in the body, not the path.
 */
export async function getUniversityEntity(universityName, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/university/university_entity', {
    method: 'GET',
    tokenKey,
    body: { university_name: universityName },
  });
  return data;
}

/** Full country record for prefilling the edit form. */
export async function getCountryEntity(countryName, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/country/country_entity', {
    method: 'GET',
    tokenKey,
    body: { country_name: countryName },
  });
  return data;
}

export async function getFaculties({ universityName }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/faculty/get_faculties', {
    method: 'GET',
    tokenKey,
    query: { university_name: universityName },
  });
  return asArray(data);
}

export async function addFaculty(
  { facultyName, universityName },
  { tokenKey = ADMIN_TOKEN_KEY } = {},
) {
  const { data } = await request('/faculty/add', {
    method: 'POST',
    tokenKey,
    body: { faculty_name: facultyName, university_name: universityName },
  });
  return data;
}

export async function deleteFaculty(
  { facultyName, universityName },
  { tokenKey = ADMIN_TOKEN_KEY } = {},
) {
  const { data } = await request('/faculty/delete', {
    method: 'DELETE',
    tokenKey,
    body: { faculty_name: facultyName, university_name: universityName },
  });
  return data;
}

export async function createContact({ phone, service, name }) {
  const { data } = await request('/contact/add', {
    method: 'POST',
    auth: false,
    body: { phone, service, name },
  });
  return data;
}

export async function getTopComments() {
  const { data } = await request('/applicant/top_comments', { auth: false });
  return asArray(data);
}

/** All applicant comments. Admin token required. */
export async function getAllComments({ tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/applicant/all', { tokenKey });
  return asArray(data);
}

/** Identifies a comment by name + comment text. Admin token required. */
export async function deleteComment({ name, comment }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/applicant/delete', {
    method: 'DELETE',
    tokenKey,
    body: { name, comment },
  });
  return data;
}

export async function sendReview({ token, service, comment }) {
  const { data } = await request('/applicant/review', {
    method: 'POST',
    auth: false,
    body: { token, service, comment },
  });
  return data;
}

export async function generateCommentLink({ name, email }, { tokenKey = ADMIN_TOKEN_KEY } = {}) {
  const { data } = await request('/applicant/generate', {
    method: 'POST',
    tokenKey,
    body: { name, email },
  });
  return data;
}

export async function addApplicantComment(
  { name, comment, service },
  { tokenKey = USER_TOKEN_KEY } = {},
) {
  const { data } = await request('/applicant/add', {
    method: 'POST',
    tokenKey,
    body: { name, comment, service },
  });
  return data;
}
