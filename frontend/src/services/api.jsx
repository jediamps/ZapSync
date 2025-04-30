import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // Change this to match your backend URL

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, userData);
    return response.data; // Return response data (token, user info, etc.)
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error.response?.data || error.message; // Throw error for handling in frontend
  }
};

export const loginUser = async (email, password, latitude, longitude) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, {
        email,
        password,
        latitude,
        longitude,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const googleLogin = async (googleToken, latitude, longitude) => {
    try {
      const response = await axios.post(`${API_URL}/google-login/`, {
        token: googleToken,
        latitude,
        longitude,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

// Function to log out a user
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token from storage
};

// Function to get authenticated user details
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` }, // Send token in header
    });
    return response.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


