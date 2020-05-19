const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalizeUrl = require('normalize-url');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const checkObjectId = require('../../middleware/checkObjectId');

router.get('/', [auth], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
    
    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }
    
    return res.json(profile);
  } catch (e) {
    return res.status(500).send('Server Error');
  }
});

const profileValidation = [
  check('company', 'Company must be a string').isString().trim().escape().optional(),
  check('githubusername', 'Github user name must be a string').isString().trim().escape().optional(),
  check('bio', 'Bio must be a string').isString().trim().escape().optional(),
  check('location', 'Location must be a string').isString().trim().escape().optional(),
  check('website', 'Website must be a string').trim().escape().isString().optional(),
  check('status', 'Status must be a string').isString().trim().escape().not().isEmpty().withMessage('Status is required'),
  check('skills', 'Skills is required').not().isEmpty(),
  check('facebook', 'Facebook must be string').trim().escape().isString().optional(),
  check('youtube', 'YouTube must be string').trim().escape().isString().optional(),
  check('twitter', 'Twitter must be string').trim().escape().isString().optional(),
  check('linkedin', 'LinkedIn must be string').trim().escape().isString().optional(),
  check('instagram', 'Instagram must be string').trim().escape().isString().optional(),
];
router.post('/', [auth, profileValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { company, website, location, bio, status, githubusername, skills, youtube, twitter, facebook, linkedin, instagram } = req.body;
  
  const profileFields = {
    user: req.user.id,
    company,
    website: website === '' ? '' : normalizeUrl(website, { forceHttps: true }),
    location,
    bio,
    status,
    githubusername,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
  };
  
  
  // Social
  const socialFields = { youtube, twitter, facebook, linkedin, instagram };
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0) {
      socialFields[key] = normalizeUrl(value, { forceHttps: true })
    }
  }
  
  profileFields.social = socialFields;
  
  try {
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);
    
    if (!profiles) {
      return res.status(404).json({ msg: 'There is no profiles' });
    }
    
    return res.json(profiles);
  } catch (e) {
    return res.status(500).send('Server Error');
  }
});

router.get('/user/:user_id', [checkObjectId('user_id')], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    
    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }
    
    return res.json(profile);
  } catch (e) {
    return res.status(500).send('Server Error');
  }
});

const experienceValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required and needs to be from the past').not().isEmpty().custom((value, { req }) => (req.body.to ? value < req.body.to : true))
];

router.post('/experience', [auth, experienceValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, company, location, from, to, current, description } = req.body;
  const newExp = { title, company, location, from, to, current, description };
  
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

router.put('/experience/:exp_id', [auth, checkObjectId('exp_id'), experienceValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, company, location, from, to, current, description } = req.body;
  
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    const exp = await profile.experience.id(req.params.exp_id);
    if (!exp) {
      return res.status(404).json({ error: "Experience not found" });
    }
    
    exp.title = title;
    exp.company = company;
    exp.location = location;
    exp.from = from;
    exp.to = to;
    exp.current = current;
    exp.description = description;
    
    await profile.save();
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

router.delete('/experience/:exp_id', [auth, checkObjectId('exp_id')], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    const exp = await profile.experience.id(req.params.exp_id);
    if (!exp) {
      return res.status(404).json({ error: "Experience not found" });
    }
    
    const exp_index = await profile.experience.indexOf(exp);
    await profile.experience.splice(exp_index, 1);
    await profile.save();
    
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

const educationValidation = [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required and needs to be from the past').not().isEmpty().custom((value, { req }) => (req.body.to ? value < req.body.to : true))
];

router.post('/education', [auth, educationValidation], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { school, degree, fieldofstudy, from, to, current, description } = req.body;
  const newEdu = { school, degree, fieldofstudy, from, to, current, description };
  
  try {
    const profile = await Profile.findOne({ user: req.user.id});
    
    if (!profile) {
      return res.status(404).json({error: "Profile not found"});
    }
    
    profile.education.unshift(newEdu)
    await profile.save();
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

router.put('/education/:edu_id', [auth, checkObjectId('edu_id'), educationValidation], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { school, degree, fieldofstudy, from, to, current, description } = req.body;
  
  try {
    const profile = await Profile.findOne({ user: req.user.id});
    
    if (!profile) {
      return res.status(404).json({error: "Profile not found"});
    }
    
    const edu = await profile.education.id(req.params.edu_id);
    if (!edu) {
      return res.status(404).json({error: "Education not found"});
    }
    edu.school = school;
    edu.degree = degree;
    edu.fieldofstudy = fieldofstudy;
    edu.from = from;
    edu.to = to;
    edu.current = current;
    edu.description = description;
    
    await profile.save();
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

router.delete('/education/:edu_id', [auth, checkObjectId('edu_id')], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id});
    
    if (!profile) {
      return res.status(404).json({error: "Profile not found"});
    }
    
    const edu = await profile.education.id(req.params.edu_id);
    if (!edu) {
      return res.status(404).json({error: "Education not found"});
    }
    
    const edu_index = await profile.education.indexOf(edu);
    await profile.education.splice(edu_index, 1);
    await profile.save();
    
    res.json(profile);
  } catch (e) {
    return res.json(e);
  }
});

module.exports = router;