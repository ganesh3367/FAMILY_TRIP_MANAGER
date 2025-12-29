const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

router.get('/:tripId', async (req, res) => {
    try {
        const destinations = await Destination.find({ tripId: req.params.tripId }).sort({ order: 1 });
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const destination = new Destination({
        tripId: req.body.tripId,
        name: req.body.name,
        country: req.body.country,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate,
        order: req.body.order
    });

    try {
        const newDestination = await destination.save();
        res.status(201).json(newDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
