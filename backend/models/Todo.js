const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
