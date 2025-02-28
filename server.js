const express = require('express'); 
const { v4: uuidv4 } = require('uuid'); // For generating unique short codes
const app = express();
const port = 3000; // Or any port you choose

// In-memory storage for short URLs (replace with a database in a real application)
const urlMap = {};
const analytics = {};

app.use(express.json()); // Enable JSON body parsing

// ✅ Root Route (Fix for "Cannot GET /" error)
app.get('/', (req, res) => {
    res.send('Welcome to Shortify URL Shortener API! Use POST /shorten to create short URLs.');
});

// ✅ POST /shorten endpoint
app.post('/shorten', (req, res) => {
    const longUrl = req.body.longUrl;

    if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
    }

    // Generate a unique short code (UUID is a good option for uniqueness)
    const shortCode = uuidv4().substring(0, 6); // Take the first 6 characters

    // Store the mapping (replace with database interaction in a real application)
    urlMap[shortCode] = longUrl;
    analytics[shortCode] = { clicks: 0 };

    const shortUrl = `http://localhost:${port}/r/${shortCode}`; // Or your domain
    res.json({ shortUrl });
});

// ✅ GET /r/:code endpoint
app.get('/r/:code', (req, res) => {
    const shortCode = req.params.code;
    const longUrl = urlMap[shortCode];

    if (!longUrl) {
        return res.status(404).send('Short URL not found');
    }

    // Record analytics
    analytics[shortCode].clicks++;
    analytics[shortCode].lastAccess = new Date();
    analytics[shortCode].userAgent = req.headers['user-agent'];

    // Redirect to the long URL
    res.redirect(longUrl);
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
