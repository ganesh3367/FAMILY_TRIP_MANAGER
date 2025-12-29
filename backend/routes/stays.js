const express = require('express');
const router = express.Router();
const Stay = require('../models/Stay');

router.get('/trip/:tripId', async (req, res) => {
    try {
        const stays = await Stay.find({ tripId: req.params.tripId });
        res.json(stays);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const stay = new Stay({
        tripId: req.body.tripId,
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        cost: req.body.cost
    });

    try {
        const newStay = await stay.save();
        res.status(201).json(newStay);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
