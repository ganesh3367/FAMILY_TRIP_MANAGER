const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

const INITIAL_DATA = {
    trips: [],
    destinations: [],
    transport: [],
    stays: [],
    activities: [],
    expenses: [],
    todos: []
};

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const storage = {
    get: (collection, query = {}) => {
        const data = readDB()[collection] || [];
        return data.filter(item => {
            return Object.entries(query).every(([key, value]) => item[key] == value);
        });
    },

    getById: (collection, id) => {
        const data = readDB()[collection] || [];
        return data.find(item => item._id == id);
    },

    create: (collection, item) => {
        const db = readDB();
        const newItem = { ...item, _id: Date.now().toString(), createdAt: new Date() };
        db[collection] = db[collection] || [];
        db[collection].push(newItem);
        writeDB(db);
        return newItem;
    },

    update: (collection, id, updates) => {
        const db = readDB();
        const index = db[collection].findIndex(item => item._id == id);
        if (index === -1) return null;
        db[collection][index] = { ...db[collection][index], ...updates };
        writeDB(db);
        return db[collection][index];
    },

    delete: (collection, id) => {
        const db = readDB();
        db[collection] = db[collection].filter(item => item._id != id);
        writeDB(db);
        return true;
    }
};

module.exports = storage;
