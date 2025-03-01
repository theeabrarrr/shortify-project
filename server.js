const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Url = require('./models/Url');
const validUrl = require('valid-url');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener API');
});

// Shorten URL endpoint
app.post('/shorten', async (req, res, next) => {
    try {
        const { originalUrl } = req.body;
        
        // ✅ Check if the URL is valid
        if (!originalUrl || !validUrl.isUri(originalUrl)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const shortCode = Math.random().toString(36).substring(2, 8);
        const newUrl = new Url({ shortCode, originalUrl });

        await newUrl.save();
        res.json({ shortUrl: `${req.protocol}://${req.get('host')}/r/${shortCode}` });
    } catch (err) {
        next(err);
    }
});

// Redirect from short URL
app.get('/r/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const urlEntry = await Url.findOne({ shortCode: code });

        if (!urlEntry) return res.status(404).json({ error: 'Short URL not found' });

        urlEntry.clickCount += 1;
        await urlEntry.save();

        res.redirect(urlEntry.originalUrl);
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));