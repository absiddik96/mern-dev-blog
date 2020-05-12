const express = require('express');
const connectDB =  require('./config/db');
const app = express();
const port = process.env.PORT || 5000;

// Connect database
connectDB();

// Test Route
app.use('/', (req, res) => {
  res.json({mgs: "this is test"});
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

