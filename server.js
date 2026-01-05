const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

// Serve index.html for any non-API request
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
