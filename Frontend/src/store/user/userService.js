import axios from "axios";
const port = import.meta.env.VITE_PORT;
const BASE_URL = import.meta.env.MODE === 'development' ? `http://localhost:${port}/` : '/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Enable sending cookies with requests for better security
});

// Function to fetch all users
const fetchUsersService = async () => {
  try {
    const response = await apiClient.get(`api/auth/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCurrentUserService = async () => {
  try {
    const response = await apiClient.get(`api/auth/user/current`); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a user
const deleteUserService = async (id) => {
  try {
    const response = await apiClient.delete(`api/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function for the user to update password, phoneNumber, address, companyAddress, companyNumber
const updateUserInfo = async (id, userInfo) => {
  try {
    const res = await apiClient.put(`api/auth/users/${id}`, userInfo);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Function to update a user's role
const updateUserRoleService = async (id, role) => {
  try {
    const response = await apiClient.put(
      `api/auth/users/${id}/role`,
      { role }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  fetchUsersService,
  fetchCurrentUserService,
  deleteUserService,
  updateUserInfo,
  updateUserRoleService,
  apiClient,
};

export default userService;