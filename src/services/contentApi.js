import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../config/api';
import { asArray, request, toFormData } from './httpClient';

export async function getTopCountries() {
  const { data } = await request('/country/top_countries', { auth: false });
  return asArray(data);
}

export async function getCountryLogos() {
  const { data } = await request('/country/country_logos', { auth: false });
  return asArray(data);
}

export async function getCountry(countryName) {
  const { data } = await request(`/country/${encodeURIComponent(countryName)}`, {
    auth: false,
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
