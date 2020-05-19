const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  // Verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (e) {
    res.status(500).json({ errors: "Server error"})
  }
};

module.exports = auth;