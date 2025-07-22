const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api', (req, res) => {
  const { latitude, longitude, state, pincode } = req.body;

  // Simulate an API response
  const response = {
    latitude,
    longitude,
    state,
    pincode,
    prediction: 'moderate with an average depth of 15 meters'
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
