import logging
from flask import Flask, request, render_template, jsonify
import pandas as pd
import pickle
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Load pre-trained model and dataset
model = pickle.load(open("ayush2.pkl", "rb"))  # Replace with your model filename
dataset = pd.read_csv("ayush2.csv")  # Replace with your dataset filename

@app.route("/")
def index():
    return render_template("index_2.html")

@app.route("/predict", methods=["POST"])
def predict_gw_level():
    try:
        # Extract input data
        user_data = request.get_json()
        logging.debug(f"User data received: {user_data}")

        # Validate and parse input
        year = int(user_data.get("year"))
        month = int(user_data.get("month"))
        day = int(user_data.get("day", 1))  # Default day to 1 if not provided
        latitude = float(user_data.get("latitude"))
        longitude = float(user_data.get("longitude"))
        rainfall_changes = float(user_data.get("rainfall_changes"))

        # Extract relevant rows for location and time
        location_data = dataset[
            (dataset["Latitude"] == latitude) & 
            (dataset["Longitude"] == longitude)
        ]

        if location_data.empty:
            return jsonify({"error": "No data found for the given latitude and longitude."}), 404

        # Adjust rainfall values for valid months
        valid_months = [1, 5, 8, 11]  # January, May, August, November
        adjusted_rainfall = {}

        for valid_month in valid_months:
            # Use previous year's rainfall data for adjustment
            historical_row = location_data[
                (location_data["year"] == year - 1) & 
                (location_data["month"] == valid_month)
            ]

            if historical_row.empty:
                return jsonify({"error": f"No rainfall data found for {year - 1}-{valid_month}."}), 404

            original_rainfall = historical_row["Rainfall (mm)"].iloc[0]
            adjusted_rainfall[valid_month] = original_rainfall + (original_rainfall * rainfall_changes / 100)

        # Prepare features for the prediction
        latest_row = location_data.iloc[0]  # Use the first matching row for the location
        features = {
            "landuse": latest_row["landuse"],
            "Soil porosity (%)": latest_row["Soil porosity (%)"],
            "Latitude": latitude,
            "Longitude": longitude,
            "Soil Type": latest_row["Soil Type"],
            "Population Density": latest_row["Population Density"],
            "Rainfall (mm)": adjusted_rainfall.get(month, 0),  # Use adjusted rainfall for the input month
            "year": year,
            "month": month,
            "day": day,
        }

        # Convert features to input format expected by the model
        feature_df = pd.DataFrame([features])
        prediction = model.predict(feature_df)[0]

        return jsonify({
            "predicted_gw_level": prediction.round(2),
            "adjusted_rainfall": adjusted_rainfall.get(month, 0).round(2)
        })

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5002)
