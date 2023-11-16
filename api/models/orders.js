// src/models/orderModule.js

const { db } = require("../services/database");

class Order {
  constructor({ receiptNumber, receivedDate, deliveryDate, deliveryAddress, fullPrice, deliveryPrice, orderPrice, customerPhone, orderStatus, userId }) {
    this.receiptNumber = receiptNumber;
    this.receivedDate = receivedDate;
    this.deliveryDate = deliveryDate;
    this.deliveryAddress = deliveryAddress;
    this.fullPrice = fullPrice;
    this.deliveryPrice = deliveryPrice;
    this.orderPrice = orderPrice;
    this.customerPhone = customerPhone;
    this.orderStatus = orderStatus;
    this.userId = userId;
  }

  static createOrder(order, callback) {
    const query =
      'INSERT INTO orders (receiptNumber, receivedDate, deliveryDate, deliveryAddress, fullPrice, deliveryPrice, orderPrice, customerPhone, orderStatus, userId) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(
      query,
      [
        order.receiptNumber,
        order.receivedDate,
        order.deliveryDate,
        order.deliveryAddress,
        order.fullPrice,
        order.deliveryPrice,
        order.orderPrice,
        order.customerPhone,
        order.orderStatus,
        order.userId,
      ],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static getOrdersByUser(userId, data, callback) {
    const { startDate, endDate, status } = data;
    const query = `SELECT * FROM orders WHERE userId = ? 
      AND (? is NULL OR orderStatus = ?)  
      AND receivedDate BETWEEN ? AND ?`;
    db.query(query, [userId, status, status, startDate, endDate], (err, orders) => {
      if (err) {
        return callback(err);
      }
      callback(null, orders);
    });
  }

  static getOrderById(orderId, callback) {
    const query = 'SELECT * FROM orders WHERE order_id = ?';
    db.query(query, [orderId], (err, orders) => {
      if (err) {
        return callback(err);
      }
      if (orders.length === 0) {
        return callback(null, null);
      }
      callback(null, orders[0]);
    });
  }

  static updateOrderById(orderId, updatedData, callback) {
    const query = 'UPDATE orders SET ? WHERE order_id = ?';
    db.query(query, [updatedData, orderId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static deleteOrderById(orderId, callback) {
    const query = 'DELETE FROM orders WHERE order_id = ?';
    db.query(query, [orderId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static checkIfReceiptNumberExists(receiptNumber, callback) {
    const query = 'SELECT COUNT(*) AS count FROM orders WHERE receiptNumber = ?';
    db.query(query, [receiptNumber], (err, results) => {
      if (err) {
        return callback(err);
      }
      const exists = results[0].count > 0;
      callback(null, exists);
    });
  }
}

module.exports = Order;
