import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API URL

// Define API endpoints for order-related operations
const ORDER_API = {
  getOrdersByUser: `/orders`,
  createOrder: '/orders',
  updateOrder: (orderId) => `/orders/${orderId}`,
  deleteOrder: (orderId) => `/orders/${orderId}`,
  // Add more endpoints as needed
};

// Function to get orders for a specific user
export const getOrdersByUser = async (userId, startDate, endDate, status) => {
  // Build the URL with optional query parameters
  let params = `userId=${userId}&startDate=${startDate}&endDate=${endDate}&${status ? `status=${status}` : ''}`;
  return axios({
    url: `${API_BASE_URL}${ORDER_API.getOrdersByUser}?${params}`,
    method: 'GET',
    headers: {
        Authorization: localStorage.getItem('token')
    }
  });

};

// Function to create a new order
export const createOrder = async (orderData) => {
  return await axios({
    url: `${API_BASE_URL}${ORDER_API.createOrder}`,
    method: 'POST',
    headers: {
        Authorization: localStorage.getItem('token')
    },
    data: orderData
  });
};

// Function to update an order by ID
export const updateOrder = async (orderId, orderData) => {
  return await axios({
    url: `${API_BASE_URL}${ORDER_API.updateOrder(orderId)}`,
    method: 'PUT',
    headers: {
        Authorization: localStorage.getItem('token')
    },
    data: orderData
  });
};

// Function to delete an order by ID
export const deleteOrder = async (orderId) => {
  return await axios({
    url: `${API_BASE_URL}${ORDER_API.deleteOrder(orderId)}`,
    method: 'DELETE',
    headers: {
        Authorization: localStorage.getItem('token')
    },
  });
};

// Export other order-related API functions as needed