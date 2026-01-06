const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/trips', require('./routes/trips'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/stays', require('./routes/stays'));
app.use('/api/activities', require('./routes/activities'));

app.get('/', (req, res) => {
    res.send('Family Trip Manager API is running...');
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/family-trip-manager';

global.isOfflineMode = false;

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.log('⚠️ MongoDB Offline. Switching to Local JSON Storage.');
        global.isOfflineMode = true;
    });

app.listen(PORT, () => {
    console.log(`Live on port ${PORT}`);
});
