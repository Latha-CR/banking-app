const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

router.get('/', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    const transactions = await Transaction.find({ fromAccountId: account._id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/transfer', auth, async (req, res) => {
  try {
    const { toAccountNumber, amount, description } = req.body;
    const fromAccount = await Account.findOne({ userId: req.user.id });
    
    if (!fromAccount) {
      return res.status(404).json({ msg: 'Your account not found' });
    }

    if (fromAccount.currentBalance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) {
      return res.status(404).json({ msg: 'Recipient account not found' });
    }

    fromAccount.currentBalance -= amount;
    toAccount.currentBalance += amount;
    await fromAccount.save();
    await toAccount.save();

    const transaction = new Transaction({
      fromAccountId: fromAccount._id,
      toAccountNumber,
      amount,
      description,
      movementType: 'DEBIT'
    });
    await transaction.save();

    res.json({ msg: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;