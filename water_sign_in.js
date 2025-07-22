// Location Functionality
document.getElementById('getLocation').addEventListener('click', function () {
    const locationStatus = document.getElementById('locationStatus');
    locationStatus.textContent = "Attempting to get your location...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                locationStatus.textContent = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)} (Accuracy: ±${accuracy.toFixed(2)} meters)`;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ±${accuracy} meters`);
            },
            (error) => {
                handleLocationError(error, locationStatus);
            },
            {
                enableHighAccuracy: true, // Improves accuracy but uses more resources
                timeout: 10000, // 10 seconds timeout
                maximumAge: 0 // Always get the fresh location
            }
        );
    } else {
        locationStatus.textContent = "Geolocation is not supported by this browser.";
    }
});

function handleLocationError(error, element) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            element.textContent = "Permission denied: Please enable location permissions in your browser settings.";
            break;
        case error.POSITION_UNAVAILABLE:
            element.textContent = "Position unavailable: Location data could not be retrieved.";
            break;
        case error.TIMEOUT:
            element.textContent = "Request timed out: Unable to retrieve location within the specified time.";
            break;
        default:
            element.textContent = "An unknown error occurred while retrieving location.";
            break;
    }
    console.error("Geolocation Error:", error.message);
}

// Form Validation
function validateForm() {
    const createUsername = document.getElementById('createUsername').value;
    const createPassword = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const usernameMessage = document.getElementById('usernameMessage');

    // Check if username is entered
    if (createUsername.trim() === '') {
        alert("Please create a username.");
        return false;
    }

    // Check if password and confirm password match
    if (createPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    // If validation passes, show message and allow submission
    usernameMessage.textContent = `Username '${createUsername}' has been created successfully!`;
    return true; // Allow form submission
}
