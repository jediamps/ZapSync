import axios from "axios";

// const BASE_URL = "http://localhost:8000/api"; 
const BASE_URL = "https://zapsync.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("zapsync_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., logout user)
      localStorage.removeItem("zapsync_token");
      // You might want to redirect to login page here
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const loginUser = async (email, password, latitude, longitude) => {
  try {
    // Fetch IP, city, and country using ipapi
    const locationRes = await axios.get("https://ipapi.co/json/");
    const { ip, country_name, city, region } = locationRes.data;

    const response = await api.post("/users/login/", {
      email,
      password,
      latitude,
      longitude,
      ip_address: ip,
      country: country_name,
      city: region + ", " + city,
    });

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const googleLogin = async (googleToken, latitude, longitude) => {
  try {
    // Fetch IP, city, and country using ipapi
    const locationRes = await axios.get("https://ipapi.co/json/");
    const { ip, country_name, city, region } = locationRes.data;
    const response = await api.post("/google-login/", {
      token: googleToken,
      latitude,
      longitude,
      ip_address: ip,
      country: country_name,
      city: region + ", " + city,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to log out a user
export const logoutUser = () => {
  localStorage.removeItem("zapsync_token"); 
};


export const uploadFile = async (file, description) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  const response = await api.post("/files/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getFiles = async () => {
  try {
    const response = await api.get("/files/all/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchFiles = async (query) => {
  try {
    const response = await api.get(`/files/search/?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStorageUsage = async () => {
  try {
    const response = await api.get("/storage/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile/", profileData);
    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error;
  }
};



export const createFolder = async (folderData) => {
  const response = await api.post('/folders/create/', folderData);
  return response.data;
};

export const uploadFilesToFolder = async (folderId, files) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files[]', file);  // Changed from files[index] to files[]
  });

  const response = await api.post(`/folders/${folderId}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getFolders = async () => {
  try {
    const response = await api.get("/folders/all/");
    return response.data;
  } catch (error) {
    throw error;
  }
};