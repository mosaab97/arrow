const bcrypt = require("bcrypt");
const { pool, executeQuery } = require("../services/database");

class User {
  constructor({
    userName,
    email,
    password,
    displayName,
    address,
    phoneNumber,
    logo,
    userRole,
  }) {
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.displayName = displayName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.logo = logo;
    this.userRole = userRole; // Add userRole field
  }

  static createUser(user, callback) {
    const query =
      "INSERT INTO users (userName, email, password, displayName, address, phoneNumber, logo) VALUES (?, ?, ?, ?, ?, ?, ?);";

    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      executeQuery(
        query,
        [
          user.userName,
          user.email,
          hashedPassword,
          user.displayName,
          user.address,
          user.phoneNumber,
          user.logo,
        ],
        callback
      );
    });
  }

  static findByEmail(email, callback) {
    const query = "SELECT * FROM users WHERE email = ?";
    executeQuery(query, [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  static comparePassword(candidatePassword, hashedPassword, callback) {
    bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  }

  static updateUser(
    { userName, email, displayName, address, phoneNumber, userId },
    callback
  ) {
    const query =
      "UPDATE users SET userName = ?, email = ?, displayName = ?, address = ?, phoneNumber = ? WHERE id = ?";
    executeQuery(
      query,
      [userName, email, displayName, address, phoneNumber, userId],
      callback
    );
  }

  static getUserById(userId, callback) {
    const query = "SELECT * FROM users WHERE id = ?";
    executeQuery(query, [userId], (err, users) => {
      if (err) {
        return callback(err);
      }
      if (users.length === 0) {
        return callback(null, null);
      }
      callback(null, users[0]);
    });
  }

  static getAllUsers = (req, res) => {
    const query =
      "SELECT id, userName, email, displayName, address, phoneNumber, logo FROM users";
    executeQuery(query, [], (err, users) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching users" });
      }
      res.status(200).json({ users });
    });
  };

  static deleteUser(userId, callback) {
    const query = "DELETE FROM users WHERE id = ?";
    executeQuery(query, [userId], callback);
  }

  static uploadLogo(id, logo, callback) {
    const query = "UPDATE users SET logo = ? WHERE id = ?";

    executeQuery(query, [logo, id], callback);
  }

  static updatePassword(newPassword, userId, callback) {
    const query = "update users set password = ? where id = ?";
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      executeQuery(query, [hashedPassword, userId], callback);
    });
  }
}

module.exports = User;
