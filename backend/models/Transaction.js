// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
