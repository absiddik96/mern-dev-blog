const mongoose = require('mongoose');

const checkObjectId = (IdToCheck) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[IdToCheck])) {
    return res.status(400).json({ msg: 'Invalid ID' });
  }
  next();
};

module.exports = checkObjectId;