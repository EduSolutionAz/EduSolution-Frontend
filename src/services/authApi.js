import { ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, USER_TOKEN_KEY, USER_TOKEN_TTL_KEY } from '../config/api';
import { request, writeToken } from './httpClient';

export async function register({ email, name, phone }) {
  const { data } = await request('/user/register', {
    method: 'POST',
    auth: false,
    body: { email, name, phone },
  });
  return data;
}

export async function verifyCode({ email, code }) {
  const { data } = await request('/user/register/verify', {
    method: 'POST',
    auth: false,
    body: { email, code },
  });
  return data;
}

export async function createPassword({ email, password }) {
  const { data } = await request('/user/register/password', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await request('/user/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
  writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, data?.token, data?.expires_in);
  return data;
}

export async function adminLogin({ username, password }) {
  const { data } = await request('/admin/login', {
    method: 'POST',
    auth: false,
    body: { username, password },
  });
  writeToken(ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, data?.token, data?.expires_in);
  return data;
}

export async function adminRegister({ username, password, email }) {
  const { data } = await request('/admin/add', {
    method: 'POST',
    tokenKey: ADMIN_TOKEN_KEY,
    body: { username, password, email },
  });
  return data;
}

export function logout(kind = 'user') {
  if (kind === 'admin') writeToken(ADMIN_TOKEN_KEY, ADMIN_TOKEN_TTL_KEY, null);
  else writeToken(USER_TOKEN_KEY, USER_TOKEN_TTL_KEY, null);
}
