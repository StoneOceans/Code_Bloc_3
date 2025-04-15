import axios from 'axios'

const BASE_URL = 'http://sitedesjo.college-hanned.net/api/';
const LOGIN_URL = `${BASE_URL}tokens/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const NOTES_URL = `${BASE_URL}notes/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};


export const refresh_token = async () => {
  try {
    const response = await axios.post(
      REFRESH_URL,
      {},
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
};

export const get_notes = async () => {
  try {
    const response = await axios.get(NOTES_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Non authentifié, retour notes vide");
      return []; 
    }
    throw error; 
  }
};


const call_refresh = async (error, func) => {
  if (error.response && error.response.status === 401) {

    const tokenRefreshed = await refresh_token();

    if (tokenRefreshed) {
      const retryResponse = await func(); 
      return retryResponse.data;
    }
  }
  return false;
};

export const logout = async () => {
  try {
    await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return false;
  }
};

export const is_authenticated = async () => {
  const response = await axios.get(AUTH_URL, { withCredentials: true });
  return response.data.authenticated; 
};



export const register = async (username, email, password) => {
  try {
    const response = await axios.post(
      REGISTER_URL,
      { username, email, password },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.error || "Registration failed",
      errors: error.response?.data?.errors || {}
    };
  }
};