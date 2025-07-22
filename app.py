from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
from datetime import datetime
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
import pickle


data = pd.read_csv('training_data.csv') 

try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading the model: {e}")

neighbor_model = NearestNeighbors(n_neighbors=5)
neighbor_model.fit(data[['Latitude', 'Longitude']])

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/get-trained-points', methods=['GET'])
def get_trained_points():
    try:
      
        points = data[['Latitude', 'Longitude', 'predicted_gw_level']].to_dict(orient='records')
        return jsonify(points), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict-trained-points', methods=['POST'])
def predict_trained_points():
    try:
        user_data = request.json
        datetime_str = user_data['Datetime']
        dt = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M")
        dayofyear = dt.timetuple().tm_yday
        weekofyear = dt.isocalendar()[1]
        quarter = (dt.month - 1) // 3 + 1
        trained_points = data[['Latitude', 'Longitude', 'pH Level', 'Landuse', 'Soil Type', 'Drainage', 
                               'Soil Depth (m)', 'Soil Porosity', 'Organic Matter', 
                               'POPULATION_DENSITY(people/sq km)', 'Humidity (%)', 'Avg. Tidal Height (metres)', 
                               'Avg. Wind Speed (km/h)', 'Avg. Temperature (°C)', 'Soil Moisture (%)', 
                               'Avg. Surface Elevation (meters above sea level)', 'Rainfall', 
                               'Permeability Value (Numeric)']].copy()
        trained_points['dayofyear'] = dayofyear
        trained_points['weekofyear'] = weekofyear
        trained_points['quarter'] = quarter
        trained_points['predicted_gw_level'] = model.predict(trained_points)
        trained_points_json = trained_points[['Latitude', 'Longitude', 'predicted_gw_level']].to_dict(orient='records')

        return jsonify(trained_points_json), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict-untrained', methods=['POST'])
def predict_untrained_point():
    global data, neighbor_model 

    try:
       
        user_data = request.json
        latitude = user_data['Latitude']
        longitude = user_data['Longitude']
        untrained_point = [[latitude, longitude]]
        distances, indices = neighbor_model.kneighbors(untrained_point)

        updated_data=pd.read_csv('training_updated.csv')
        nearest_points = updated_data.iloc[indices[0]]
        mean_gw_level = nearest_points['predicted_gw_level'].mean()
        new_point = pd.DataFrame([{
            "Latitude": latitude,
            "Longitude": longitude,
            "predicted_gw_level": mean_gw_level
        }])
        data = pd.concat([data, new_point], ignore_index=True)

        try:
            data.to_csv('training_updated.csv', index=False)
            print("File saved successfully.")
        except Exception as e:
            print(f"Error saving file: {e}")
        neighbor_model.fit(data[['Latitude', 'Longitude']])
        return jsonify({
            "latitude": latitude,
            "longitude": longitude,
            "estimated_groundwater_level": mean_gw_level
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
