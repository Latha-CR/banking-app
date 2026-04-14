const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    res.json(account);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;