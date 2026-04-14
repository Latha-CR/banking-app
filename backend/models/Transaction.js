const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  amount: { type: Number, required: true },
  movementType: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  description: { type: String },
  timeLogged: { type: Date, default: Date.now },
  state: { type: String, default: 'SUCCESS' }
});

module.exports = mongoose.model('Transaction', transactionSchema);