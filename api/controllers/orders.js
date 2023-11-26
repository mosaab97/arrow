// src/controllers/orderController.js
const Order = require("../models/orders");
const { validationResult } = require("express-validator");

const createOrder = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    receiptNumber,
    receivedDate,
    deliveryDate,
    deliveryAddress,
    fullPrice,
    deliveryPrice,
    orderPrice,
    orderStatus,
    customerPhone,
    comment,
  } = req.body;

  const userId = req.body.userId || req.user.id;

  Order.checkIfReceiptNumberExists(receiptNumber, (err, exists) => {
    if (err) {
      return res.status(500).json({ error: "Error checking receipt number" });
    }

    if (exists) {
      return res.status(400).json({ error: "Receipt number already exists" });
    }

    const newOrder = new Order({
      receiptNumber,
      receivedDate,
      deliveryDate,
      deliveryAddress,
      fullPrice,
      deliveryPrice,
      orderPrice,
      orderStatus,
      customerPhone,
      comment,
      userId,
    });
    Order.createOrder(newOrder, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error creating order" });
      }
      res.status(201).json({
        message: "Order created successfully",
        orderId: result.insertId,
      });
    });
  });
};

const getOrders = (req, res) => {
  const userId = req.query.userId || req.user.userId;
  const isAdmin = req.user.userRole === "admin";

  Order.getOrdersByUser(userId, isAdmin, req.query, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching orders" });
    }
    let fullDeliveryPrice = 0
    const ordersWithoutDeliveryPrice = orders.map(order => {
      if(order.orderStatus === 'delivered' || order.orderStatus === 'returned after delivery') {
        fullDeliveryPrice += parseFloat(order.deliveryPrice);
      }
      !isAdmin && delete order.deliveryPrice;
      return order
    })
    res.status(200).json({ orders: ordersWithoutDeliveryPrice, fullDeliveryPrice});
  });
};

const getAllOrders = (req, res) => {
  Order.getAllOrders(req.query, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching orders" });
    }
    res.status(200).json(orders);
  });
};

const getOrder = (req, res) => {
  const orderId = req.params.orderId;

  Order.getOrderById(orderId, (err, order) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching order" });
    }
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  });
};

const updateOrder = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const orderId = req.params.orderId;
  const updatedData = req.body;

  // Check if the receiptNumber already exists for a different order
  if (updatedData.receiptNumber) {
    Order.checkIfReceiptNumberExists(
      updatedData.receiptNumber,
      (err, exists) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error checking receipt number" });
        }

        if (exists) {
          return res
            .status(400)
            .json({ error: "Receipt number already exists" });
        }

        // Update the order
        Order.updateOrderById(orderId, updatedData, (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Error updating order" });
          }
          res.status(200).json({ message: "Order updated successfully" });
        });
      }
    );
  } else {
    // Update the order without checking receiptNumber
    Order.updateOrderById(orderId, updatedData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating order" });
      }
      res.status(200).json({ message: "Order updated successfully" });
    });
  }
};

const deleteOrder = (req, res) => {
  const orderId = req.params.orderId;

  // Check if the order exists before attempting to delete
  Order.getOrderById(orderId, (err, order) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching order" });
    }

    if (!order) {
      return res.status(400).json({ error: "Order does not exist" });
    }

    // Order exists, proceed with deletion
    Order.deleteOrderById(orderId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error deleting order" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    });
  });
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
};
