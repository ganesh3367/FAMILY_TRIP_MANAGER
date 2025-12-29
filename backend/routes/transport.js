const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');

router.get('/trip/:tripId', async (req, res) => {
    try {
        const transport = await Transport.find({ tripId: req.params.tripId });
        res.json(transport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const transport = new Transport({
        tripId: req.body.tripId,
        type: req.body.type,
        departureLocation: req.body.departureLocation,
        arrivalLocation: req.body.arrivalLocation,
        departureTime: req.body.departureTime,
        arrivalTime: req.body.arrivalTime,
        cost: req.body.cost
    });

    try {
        const newTransport = await transport.save();
        res.status(201).json(newTransport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
