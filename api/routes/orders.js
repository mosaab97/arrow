// src/routes/orderRoutes.js
const express = require('express');
const { authenticateUser, isAdmin } = require('../middleware/auth'); // Import authentication and authorization middleware
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders');
const { check } = require('express-validator');

const router = express.Router();

const validateOrderCreation = [
    check('receiptNumber').isLength({ min: 1 }).withMessage('Receipt number is required'),
    check('receivedDate').isISO8601().toDate().withMessage('Received date must be a valid date in ISO 8601 format'),
    check('deliveryDate').isISO8601().toDate().withMessage('Delivery date must be a valid date in ISO 8601 format'),
    check('deliveryAddress').isLength({ min: 1 }).withMessage('Delivery address is required'),
    check('fullPrice').isDecimal().withMessage('Full price must be a valid decimal number'),
    check('deliveryPrice').isDecimal().withMessage('Delivery price must be a valid decimal number'),
    check('orderPrice').isDecimal().withMessage('Order price must be a valid decimal number'),
    check('customerPhone').isLength({ min: 1 }).withMessage('customer phone number is required'),
    check('orderStatus').isIn(['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled']).withMessage('Invalid order status'),
  ];

const validateOrderUpdate = [
    check('receiptNumber').optional().isLength({ min: 1 }).withMessage('Receipt number must be valid'),
    check('receivedDate').optional().isISO8601().toDate().withMessage('Received date must be a valid date in ISO 8601 format'),
    check('deliveryDate').optional().isISO8601().toDate().withMessage('Delivery date must be a valid date in ISO 8601 format'),
    check('deliveryAddress').optional().isLength({ min: 1 }).withMessage('Delivery address must be valid'),
    check('fullPrice').optional().isDecimal().withMessage('Full price must be a valid decimal number'),
    check('deliveryPrice').optional().isDecimal().withMessage('Delivery price must be a valid decimal number'),
    check('customerPhone').isLength({ min: 1 }).withMessage('customer phone number is required'),
    check('orderPrice').optional().isDecimal().withMessage('Order price must be a valid decimal number'),
    check('orderStatus').optional().isIn(['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled']).withMessage('Invalid order status'),
  ];

const validateDateFilters = [
    check('startDate').isISO8601().toDate().withMessage('Start date must be a valid date in ISO 8601 format'),
    check('endDate').isISO8601().toDate().withMessage('End date must be a valid date in ISO 8601 format'),
    check('status').optional().isIn(['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled']).withMessage('Invalid order status'),
  ];
// Create an order route
router.post('/', authenticateUser, validateOrderCreation, createOrder);

// Get orders for a specific user
router.get('/', authenticateUser, validateDateFilters, getOrders);

// Get a specific order by ID
router.get('/:orderId', authenticateUser, getOrder);

// Update an order
router.put('/:orderId', authenticateUser, validateOrderUpdate, updateOrder);

// Delete an order
router.delete('/:orderId', authenticateUser, deleteOrder);

module.exports = router;