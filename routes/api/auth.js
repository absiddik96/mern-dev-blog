const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

const registerValidation = [
  check('name', 'Name field is required').trim().not().isEmpty(),
  check('email', 'Email is not valid').trim().escape().isEmail().not().isEmpty().withMessage('Email field is required'),
  check('password', 'Password is not match').custom((value, {req}) => (value === req.body.confirm_password)).isLength({min: 8}).withMessage('Password at least 8 characters').trim().escape().not().isEmpty().withMessage('Password field is required'),
];

router.post('/register', [registerValidation], async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  
  // Fields
  const {name, email, password} = req.body;
  
  try {
    let user = await User.findOne({email});
    if (user) {
      return res.status(400).json({errors: [{msg: 'User already exists', param: 'email'}]})
    }
    
    const avatar = normalize(
      gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      }),
      {forceHttps: true}
    );
    
    user = new User({name, email, avatar, password});
    
    // password hashed by salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600}, (err, token) => {
      if (err) {
        throw new err
      }
      res.json({token});
    });
    
  } catch (e) {
    res.status(500).json({errors: "Server error"})
  }
});

const loginValidation = [
  check('email', 'Email is not valid').trim().escape().isEmail().not().isEmpty().withMessage('Email field is required'),
  check('password', 'Password is required').trim().escape().not().isEmpty(),
];

router.post('/login', [loginValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors})
  }
  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({errors: 'This credential do not match in our records.', param: "email"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({errors: 'This credential do not match in our records.', param: "email"});
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600}, (err, token) => {
      res.json({token});
    });
  } catch (e) {
    res.status(500).json({errors: "Server error"})
  }
});

module.exports = router;