import apiClient from "../apiClient.js";

// Function to fetch all users
const fetchUsersService = async () => {
  try {
    const response = await apiClient.get(`/api/auth/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCurrentUserService = async () => {
  try {
    const response = await apiClient.get(`/api/auth/user/current`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a user
const deleteUserService = async (id) => {
  try {
    const response = await apiClient.delete(`/api/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function for the user to update password, phoneNumber, address, companyAddress, companyNumber
const updateUserInfo = async (id, userInfo) => {
  try {
    const res = await apiClient.put(`/api/auth/users/${id}`, userInfo);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Function to update a user's role
const updateUserRoleService = async (id, role) => {
  try {
    const response = await apiClient.put(`/api/auth/users/${id}/role`, {
      role,
    });
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
