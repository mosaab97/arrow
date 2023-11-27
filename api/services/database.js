const mysql = require("mysql2");

let pool;

const initialize = () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (e) {
    console.log("Error initializing the DB");
  }
};

const executeQuery = async (sqlQuery, binds, callback) => {
  pool.query(
    sqlQuery,
    binds,
    (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    }
  );
}

module.exports = {
  initialize,
  executeQuery
};
