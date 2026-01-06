const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    country: String,
    order: { type: Number, default: 0 },
    arrivalDate: Date,
    departureDate: Date,
    lat: Number,
    lng: Number,
    origin: String,
    distance: String,
    duration: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);
