const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const auth = require('../middleware/auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    const transactions = await Transaction.find({ accountId: account._id }).sort({ timeLogged: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Transfer money
router.post('/transfer', auth, async (req, res) => {
  try {
    const { toAccountNumber, amount, description } = req.body;
    const fromAccount = await Account.findOne({ userId: req.user.id });

    if (fromAccount.currentBalance < amount)
      return res.status(400).json({ msg: 'Insufficient balance' });

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) return res.status(400).json({ msg: 'Recipient account not found' });

    fromAccount.currentBalance -= amount;
    fromAccount.availableBalance -= amount;
    await fromAccount.save();

    toAccount.currentBalance += Number(amount);
    toAccount.availableBalance += Number(amount);
    await toAccount.save();

    await Transaction.create({ accountId: fromAccount._id, amount, movementType: 'DEBIT', description });
    await Transaction.create({ accountId: toAccount._id, amount, movementType: 'CREDIT', description });

    res.json({ msg: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;