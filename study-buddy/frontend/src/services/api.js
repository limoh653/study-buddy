import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // ✅ keep your .env port unchanged

// --- AUTH ROUTES ---
export const signup = async (data) => {
  return await axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  
  // ✅ Save token after login
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }

  return response;
};

// --- PROFILE ROUTE ---
export const getProfile = async (token) => {
  return await axios.get(`${API_URL}/profile`, {
    headers: { 
      Authorization: `Bearer ${token}`, // ✅ Fixed header format
      'Content-Type': 'application/json' // ✅ Explicitly added for safety
    }
  });
};
