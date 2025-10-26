const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Serve careers data
app.get('/public/careers.min.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'careers.min.json'));
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Salary Game server running on port ${PORT}`);
    console.log(`📚 Visit http://localhost:${PORT} to play`);
    console.log('');
    console.log('💡 To build the careers data, run: npm run build:data');
});
