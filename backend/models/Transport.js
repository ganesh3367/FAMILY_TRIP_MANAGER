const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    type: {
        type: String,
        enum: ['Flight', 'Train', 'Bus', 'Car', 'Ferry', 'Other'],
        default: 'Flight'
    },
    provider: String, // Airline/Company name
    referenceNumber: String,
    departureTime: Date,
    departureLocation: String,
    arrivalTime: Date,
    arrivalLocation: String,
    cost: { type: Number, default: 0 },
    notes: String
});

module.exports = mongoose.model('Transport', transportSchema);
