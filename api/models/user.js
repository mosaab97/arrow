const bcrypt = require("bcrypt");
const { db } = require("../services/database");

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
      db.query(
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
        (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        }
      );
    });
  }

  static findByEmail(email, callback) {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
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

    db.query(
      query,
      [userName, email, displayName, address, phoneNumber, userId],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static getUserById(userId, callback) {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], (err, users) => {
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
    // You may want to add authentication and authorization checks here to ensure only authorized users can access this endpoint.

    const query =
      "SELECT id, userName, email, displayName, address, phoneNumber, logo FROM users";

    db.query(query, (err, users) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching users" });
      }
      res.status(200).json({ users });
    });
  };

  static deleteUser(userId, callback) {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static uploadLogo(id, logo, callback) {
    const query = "UPDATE users SET logo = ? WHERE id = ?";

    db.query(query, [logo, id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static updatePassword(newPassword, userId, callback) {
    const query = 'update users set password = ? where id = ?'
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      db.query(
        query,
        [
          hashedPassword,
          userId
        ],
        (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        }
      );
    });
  }
}

module.exports = User;
