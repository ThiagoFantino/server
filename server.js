const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Define a sample route
app.get('/', (req, res) => {
  res.json({ message: 'Hola, Express!' }); // Devuelve un objeto JSON
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

