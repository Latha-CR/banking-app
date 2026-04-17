const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ fullName, email, password });
    await user.save();

    // Create account for new user
    const accountNumber = 'ACC' + Date.now();
    const account = new Account({
      userId: user._id,
      accountNumber: accountNumber,
      currentBalance: 10000
    });
    await account.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;