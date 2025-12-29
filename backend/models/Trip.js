const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    budget: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    isArchived: { type: Boolean, default: false },
    tripType: { type: String, enum: ['single', 'multi-city'], default: 'single' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
