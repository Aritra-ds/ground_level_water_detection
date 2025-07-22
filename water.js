document.getElementById('predictor-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Validate temperature input
    const temperatureInput = document.getElementById('temperature');
    const temperatureError = document.getElementById('temperature-error');
    if (temperatureInput.value < -50 || temperatureInput.value > 50) {
        temperatureError.style.display = 'block';
        return; // Prevent form submission
    } else {
        temperatureError.style.display = 'none';
    }

    // Request user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPrediction, showError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showPrediction(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Placeholder for prediction logic
    const groundwaterLevel = "120 meters"; // You can replace this with actual prediction logic

    // Display the result in the "More Features" box
    const moreFeaturesBox = document.getElementById('more-features-box');
    moreFeaturesBox.innerHTML = `
        <p>Prediction successful! Your location details are:</p>
        <p><strong>Latitude:</strong> ${latitude}</p>
        <p><strong>Longitude:</strong> ${longitude}</p>
        <p><strong>Predicted Groundwater Level:</strong> ${groundwaterLevel}</p>
        
        <!-- Subscription Form -->
        <div class="subscription-form">
            <h3>Subscribe for next time Updates</h3>
            <form id="subscription-form">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                <button type="submit" class="subscribe-btn">Subscribe</button>
            </form>
        </div>
    `;
    moreFeaturesBox.style.display = 'block';

    // Attach the event listener for the subscription form
    document.getElementById('subscription-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Subscription successful! Thank you for subscribing.');
        document.getElementById('subscription-form').reset();
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
document.getElementById('predictor-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Retrieve form data
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
  
    // Create a data object to send in the request
    const requestData = {
      latitude: latitude,
      longitude: longitude,
      state: state,
      pincode: pincode
    };
  
    // Send a POST request to api.html (or the server endpoint handling the logic)
    fetch('api.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse JSON response
    })
    .then(data => {
      // Display the result from the API response
      const prediction = `Based on your location (Latitude: ${data.latitude}, Longitude: ${data.longitude}), 
                          in ${data.state}, Pincode: ${data.pincode}, the groundwater level is predicted to be 
                          ${data.prediction}.`;
  
      document.getElementById('result-data').innerText = prediction;
      document.getElementById('prediction-result').style.display = 'block';
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to get prediction data. Please try again later.');
    });
  });
  
    window.onload = function() {
        const userName = localStorage.getItem('userName') || 'Guest';
        alert(`Welcome back, ${userName}!`);
        if (!localStorage.getItem('userName')) {
            const name = prompt('Please enter your name:');
            if (name) localStorage.setItem('userName', name);
        }
    };
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('predictor-form');
        const resultContainer = document.getElementById('prediction-result');
        const resultData = document.getElementById('result-data');
    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
    
            // Example result display (customize as needed)
            const latitude = document.getElementById('latitude').value;
            const longitude = document.getElementById('longitude').value;
    
            resultData.textContent = `Prediction for Latitude: ${latitude}, Longitude: ${longitude} is complete.`;
            
            // Display result with animation
            resultContainer.classList.add('show');
        });
    });
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        alert('Welcome to the Groundwater Level Predictor!');
    }, 500); // Delay for better user experience
});
document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle');
    
    circles.forEach((circle) => {
      circle.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default navigation
        const link = circle.getAttribute('href');
        alert(`Navigating to: ${link}`);
        window.location.href = link; // Navigate to the linked page
      });
    });
  });
   
