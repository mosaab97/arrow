const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./api/routes/auth');
const orderRoutes = require('./api/routes/orders');
const { db } = require('./api/services/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));

// Add database connection here

app.use('/user', authRoutes);
app.use('/orders', orderRoutes);
app.get('*', (req, res) => {
  console.log(path.join(__dirname, 'build', 'index.html'))
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });


app.listen(port, () => {
    db.connect();
    console.log(`Server is running on port ${port}`);
});
