import axios from 'axios'

// ← relative to current host
const BASE_URL = 'https://sitedesjo.dev-data.eu/api/';
const LOGIN_URL   = `${BASE_URL}tokens/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const NOTES_URL   = `${BASE_URL}notes/`;
const LOGOUT_URL  = `${BASE_URL}logout/`;
const AUTH_URL    = `${BASE_URL}authenticated/`;
const REGISTER_URL= `${BASE_URL}register/`;
const ADMIN_URL = `${BASE_URL}is-admin/`;

export const login = async (username, password) => {
  try {
    const { data } = await axios.post(
      LOGIN_URL,
      { username, password },
      { withCredentials: true }
    );
    return data;
  } catch (err) {
    console.error("Login failed:", err);
    return false;
  }
};

export const refresh_token = async () => {
  try {
    const { data } = await axios.post(
      REFRESH_URL,
      {},
      { withCredentials: true }
    );
    return data;
  } catch {
    console.error("Refresh token failed");
    return null;
  }
};

export const get_notes = async () => {
  try {
    const { data } = await axios.get(NOTES_URL, { withCredentials: true });
    return data;
  } catch (err) {
    if (err.response?.status === 401) return [];
    throw err;
  }
};

export const logout = async () => {
  try {
    await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    window.location.href = '/';
    return true;
  } catch {
    window.location.href = '/';
    return false;
  }
};

export const is_authenticated = async () => {
  const { data } = await axios.get(AUTH_URL, { withCredentials: true });
  return data.authenticated;
};

export const register = async (username, email, password) => {
  try {
    const { data } = await axios.post(
      REGISTER_URL,
      { username, email, password },
      { withCredentials: true }
    );
    return data;
  } catch (err) {
    console.error("Registration error:", err.response?.data);
    return {
      success: false,
      error: err.response?.data?.error || "Registration failed",
      errors: err.response?.data?.errors || {}
    };
  }
};

// Optional: shared helper to retry on 401
const call_refresh = async (error, fn) => {
  if (error.response?.status === 401) {
    const refreshed = await refresh_token();
    if (refreshed) {
      const retry = await fn();
      return retry.data;
    }
  }
  return false;
};

export const isAdmin = async () => {
  try {
    const { data } = await axios.get(ADMIN_URL, { withCredentials: true });
    return data.is_admin === true;
  } catch (err) {
    console.error("Admin check failed:", err);
    return false;
  }
};