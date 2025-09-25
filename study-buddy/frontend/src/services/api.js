import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // ✅ keep your .env port unchanged

// create an axios instance for authorized requests
const apiClient = axios.create({
  baseURL: API_URL,
});

// attach token automatically for every request
apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

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

// --- STUDY GROUP ROUTES ---
// fetch all study groups
export const fetchGroups = async () => {
  return await apiClient.get("/study-group");
};

// join a group
export const joinGroup = async (groupId) => {
  return await apiClient.post("/study-group/join", { group_id: groupId });
};

// fetch groups the logged-in user has joined

// --- STUDY GROUP ROUTES ---
export const getJoinedGroups = async (token) => {
  return await axios.get(`${API_URL}/profile/groups`, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json'
    }
  });
};
