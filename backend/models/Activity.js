const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    title: { type: String, required: true },
    date: Date,
    timeSlot: String, // e.g., "10:00 AM" or "Morning"
    completed: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    notes: String,
    location: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
});

module.exports = mongoose.model('Activity', activitySchema);
