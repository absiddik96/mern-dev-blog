const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use('/', (req, res) => {
  res.json({mgs: "this is test"});
});

app.listen(port, () => {
  console.log("Server is running on port:" + port);
});

