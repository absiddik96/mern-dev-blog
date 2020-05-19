const express = require('express');
const connectDB =  require('./config/db');
const app = express();
const port = process.env.PORT || 5000;

// Connect database
connectDB();

app.use(express.json({ extended: false}));

// Test Route
app.get('/', (req, res) => {
  res.json({mgs: "this is test"});
});

//Define Route
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

