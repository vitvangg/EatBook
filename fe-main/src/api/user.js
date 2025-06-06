// src/api/user.js (ví dụ)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getUserProfile = async (userId, token) => {
  const response = await axios.get(`${API_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // Ví dụ { _id, email, displayName, ... }
};
