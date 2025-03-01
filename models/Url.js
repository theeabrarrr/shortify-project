const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    shortCode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    clickCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Url', UrlSchema);