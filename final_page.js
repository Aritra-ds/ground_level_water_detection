document.getElementById('info-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const location = document.getElementById('location').value;
  const rainfall = parseFloat(document.getElementById('rainfall').value);
  const temperature = parseFloat(document.getElementById('temperature').value);
  
  // Simulate fetching data based on the provided inputs
  const waterQuality = rainfall > 50 && temperature < 30 ? 'Good' : 'Moderate';
  const mineralPercentage = (Math.random() * 50 + 50).toFixed(2); // 50% - 100%
  const harmfulComponents = mineralPercentage > 80 ? 'Low' : 'Moderate';
  const drinkablePercentage = (Math.random() * 80 + 20).toFixed(2); // 20% - 100%
  const freshWaterDistance = (Math.random() * 10).toFixed(2); // 0-10 km
  
  const resultHtml = `
    <h4>Additional Information for ${location}:</h4>
    <p><strong>Water Quality:</strong> ${waterQuality}</p>
    <p><strong>Mineral Percentage:</strong> ${mineralPercentage}%</p>
    <p><strong>Drinkability:</strong> ${drinkablePercentage}%</p>
    <p><strong>Harmful Components:</strong> ${harmfulComponents}</p>
    <p><strong>Distance to Fresh Water:</strong> ${freshWaterDistance} km</p>
  `;
  


