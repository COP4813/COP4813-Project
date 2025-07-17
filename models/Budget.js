const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    maxBudget: { type: Number, required: true, default: 0 },
    totalSpent: { type: Number, required: true, default: 0 }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
