async function predictGWLevel(lat, lng) {
    const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent('Predicting GW level...')
        .openOn(map);

    try {
        const response = await fetch(`/predict?lat=${lat}&lon=${lng}`);
        const data = await response.json();

        if (data.gw_level !== undefined) {
            popup.setContent(`Latitude: ${lat.toFixed(4)}<br>
                              Longitude: ${lng.toFixed(4)}<br>
                              Predicted GW Level: ${data.gw_level.toFixed(2)} mbgl`);
        } else {
            popup.setContent('Error: Unable to predict GW level.');
        }
    } catch (error) {
        popup.setContent('Error: Unable to connect to backend.');
        console.error(error);
    }
}
