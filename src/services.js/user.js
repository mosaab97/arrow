import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API URL

// Define API endpoints for user-related operations
const USER_API = {
  getAllUsers: '/user/users',
  createUser: '/user/signup',
  login: '/user/login',
  updateUser: `/user/update`,
  deleteUser: (userId) => `/user/users/${userId}`,
  uploadLogo: (userId) => `/user/logo/${userId}`
  // Add more endpoints as needed
};
// Function to get all users
export const getAllUsers = async () => {
  return axios({
    url: `${API_BASE_URL}${USER_API.getAllUsers}`,
    method: 'GET',
    headers: {
        Authorization: localStorage.getItem('token')
    }
  });
};

// Function to create a new user
export const createUser = async (userData) => {
    return await axios({
        url: `${API_BASE_URL}${USER_API.createUser}`,
        method: 'POST',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        data: userData
      });
};

// Function to login a new user
export const login = async (userData) => {
    return axios.post(`${API_BASE_URL}${USER_API.login}`, userData);
  };

// Function to update a user by ID
export const updateUser = async (userData) => {
  return await axios({
    url: `${API_BASE_URL}${USER_API.updateUser}`,
    method: 'PUT',
    headers: {
        Authorization: localStorage.getItem('token'),
    },
    data: userData
  });
};

// Function to delete a user by ID
export const deleteUser = async (userId) => {
  return await axios({
    url: `${API_BASE_URL}${USER_API.deleteUser(userId)}`,
    method: 'DELETE',
    headers: {
        Authorization: localStorage.getItem('token')
    }
  });
};

export const uploadLogo = async (userId, data) => {
  return await axios({
    url: `${API_BASE_URL}${USER_API.uploadLogo(userId)}`,
    method: 'POST',
    headers: {
        Authorization: localStorage.getItem('token'),
        "Content-Type": "multipart/form-data",
    },
    data
  });
};

// Export other user-related API functions as needed
