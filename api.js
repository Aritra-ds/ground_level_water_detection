const OPENCAGE_API_KEY = 'e52c5c677a8b43b9aee0ed2ee58251ca';

// Initialize the Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a custom popup container
const popup = L.popup({
  closeButton: false,
  autoClose: false,
  className: 'custom-popup',
});

// Function to get detailed location information using OpenCage Geocoder API
async function getLocationDetails(lat, lng) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length === 0) {
      return { error: 'No location details found' };
    }

    const components = data.results[0]?.components;
    const details = {
      latitude: lat,
      longitude: lng,
      location: components?.village || components?.town || components?.hamlet || components?.city || 'Not available',
      state: components?.state || 'Not available',
      country: components?.country || 'Not available',
    };

    return details;
  } catch (error) {
    console.error('Error fetching location details:', error);
    return { error: 'Error fetching location details' };
  }
}

// Simulate a function to fetch groundwater level data
function getGroundwaterLevel(lat, lng) {
  // Mock data for demonstration
  const mockData = [
    { lat: 20.5937, lng: 78.9629, level: "(15-20 meters)" },
    { lat: 28.7041, lng: 77.1025, level: "(5-10 meters)" },
    { lat: 19.0760, lng: 72.8777, level: "(30-40 meters)" },
  ];

  // Find the closest mock data point (for simulation)
  const nearest = mockData.reduce((prev, curr) => {
    const prevDist = Math.sqrt(Math.pow(lat - prev.lat, 2) + Math.pow(lng - prev.lng, 2));
    const currDist = Math.sqrt(Math.pow(lat - curr.lat, 2) + Math.pow(lng - curr.lng, 2));
    return currDist < prevDist ? curr : prev;
  });

  return nearest.level || "Unknown";
}

// Add user's current location to the map
function addUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // Add a marker for the user's location
      const userMarker = L.marker([latitude, longitude], { icon: L.divIcon({ className: 'user-location-icon', html: '🔵', iconSize: [20, 20] }) });
      userMarker.addTo(map).bindPopup('You are here').openPopup();

      // Handle click event on user's marker
      userMarker.on('click', async () => {
        const locationDetails = await getLocationDetails(latitude, longitude);
        if (locationDetails.error) {
          popup.setLatLng([latitude, longitude])
            .setContent(`<div style="color: red;">${locationDetails.error}</div>`)
            .openOn(map);
        } else {
          const groundwaterLevel = getGroundwaterLevel(latitude, longitude);
          popup.setLatLng([latitude, longitude])
            .setContent(`
              <div style="font-size: 14px; color: #444;">
                <strong style="color: #ff4500;">Latitude:</strong> <span style="color: #008b8b;">${locationDetails.latitude}</span><br>
                <strong style="color: #ff4500;">Longitude:</strong> <span style="color: #008b8b;">${locationDetails.longitude}</span><br>
                <strong style="color: #2e8b57;">Location:</strong> <span style="color: #6a5acd;">${locationDetails.location}</span><br>
                <strong style="color: #2e8b57;">State:</strong> <span style="color: #6a5acd;">${locationDetails.state}</span><br>
                <strong style="color: #2e8b57;">Country:</strong> <span style="color: #6a5acd;">${locationDetails.country}</span><br>
                <strong style="color: #8b0000;">Groundwater Level:</strong> <span style="color: #daa520;">${groundwaterLevel}</span>
              </div>
            `)
            .openOn(map);
        }
      });
    }, (error) => {
      console.error('Error getting user location:', error);
      alert('Unable to retrieve your location');
    });
  } else {
    alert('Geolocation is not supported by this browser');
  }
}

// Handle map click events to get location details
map.on('click', async (event) => {
  const { lat, lng } = event.latlng;

  // Display a loading message in the popup
  popup.setLatLng(event.latlng)
    .setContent('<div style="color: blue;">Loading details...</div>')
    .openOn(map);

  try {
    // Fetch detailed location information from OpenCage API
    const locationDetails = await getLocationDetails(lat.toFixed(5), lng.toFixed(5));

    if (locationDetails.error) {
      popup.setContent(`<div style="color: red;">${locationDetails.error}</div>`);
      return;
    }

    // Fetch mock groundwater level data
    const groundwaterLevel = getGroundwaterLevel(lat, lng);

    // Display results in the popup
    popup.setContent(`
      <div style="font-size: 14px; color: #444;">
        <strong style="color: #ff4500;">Latitude:</strong> <span style="color: #008b8b;">${locationDetails.latitude}</span><br>
        <strong style="color: #ff4500;">Longitude:</strong> <span style="color: #008b8b;">${locationDetails.longitude}</span><br>
        <strong style="color: #2e8b57;">Location:</strong> <span style="color: #6a5acd;">${locationDetails.location}</span><br>
        <strong style="color: #2e8b57;">State:</strong> <span style="color: #6a5acd;">${locationDetails.state}</span><br>
        <strong style="color: #2e8b57;">Country:</strong> <span style="color: #6a5acd;">${locationDetails.country}</span><br>
        <strong style="color: #8b0000;">Groundwater Level:</strong> <span style="color: #daa520;">${groundwaterLevel}</span>
      </div>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    popup.setContent('<div style="color: red;">Error fetching location details. Please try again.</div>');
  }
});

// Add user's location to the map
addUserLocation();
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