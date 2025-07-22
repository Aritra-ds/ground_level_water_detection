from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle

from datetime import datetime
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
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
    return render_template('index_1.html') 

@app.route('/predict-point', methods=['POST'])
def predict_point():
    try:
       
        user_data = request.json
        latitude = user_data['Latitude']
        longitude = user_data['Longitude']
        datetime_str = user_data['Datetime']
        dt = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M")
        dayofyear = dt.timetuple().tm_yday
        weekofyear = dt.isocalendar()[1]
        quarter = (dt.month - 1) // 3 + 1
        match = data[(data['Latitude'] == latitude) & (data['Longitude'] == longitude)]

        if not match.empty:
        
            features = match.copy()
            features['dayofyear'] = dayofyear
            features['weekofyear'] = weekofyear
            features['quarter'] = quarter

            if model:
                gw_level = model.predict(features.drop(columns=['Latitude', 'Longitude']))[0]
            else:
                return jsonify({'error': 'Model not loaded'}), 500
            return jsonify({
                "latitude": latitude,
                "longitude": longitude,
                "predicted_groundwater_level": gw_level
            }), 200

        else:
            untrained_point = [[latitude, longitude]]
            distances, indices = neighbor_model.kneighbors(untrained_point)
            nearest_points = data.iloc[indices[0]]
            mean_gw_level = nearest_points['predicted_gw_level'].mean()

            return jsonify({
                "latitude": latitude,
                "longitude": longitude,
                "estimated_groundwater_level": mean_gw_level
            }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)

