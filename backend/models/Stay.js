const mongoose = require('mongoose');

const staySchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['Hotel', 'Hostel', 'Airbnb', 'Friend', 'Other'],
        default: 'Hotel'
    },
    checkIn: Date,
    checkOut: Date,
    cost: { type: Number, default: 0 },
    notes: String,
    address: String,
    bookingReference: String
});

module.exports = mongoose.model('Stay', staySchema);
