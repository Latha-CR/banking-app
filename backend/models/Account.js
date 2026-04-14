const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },
  currentBalance: { type: Number, default: 10000 },
  availableBalance: { type: Number, default: 10000 },
  currency: { type: String, default: 'INR' },
  accountOpenDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);