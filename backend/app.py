import os
import cv2
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from flask_cors import CORS

model = tf.saved_model.load("saved_model/my_model")

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "https://deepfake-detection-sage.vercel.app"}})

uploads_dir = os.path.join(app.root_path, 'uploads')
os.makedirs(uploads_dir, exist_ok=True)

def error_level_analysis(image, quality_val=90):
    try:
        _, encoded_img = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, quality_val])
        decoded_img = cv2.imdecode(encoded_img, cv2.IMREAD_UNCHANGED)
        ela_image = np.abs(image.astype(np.float32) - decoded_img.astype(np.float32))
        return ela_image
    except Exception as e:
        print("Error in error_level_analysis:", e)
        return None

def preprocess_image(image):
    try:
        resized_image = cv2.resize(image, (224, 224))
        resized_image_rgb = cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB)
        image_array = np.array(resized_image_rgb)
        return image_array
    except Exception as e:
        print("Error in preprocess_image:", e)
        return None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image found in the request'})

        img_file = request.files['image']
        if img_file:
            # Save the image to the uploads directory
            img_path = os.path.join(uploads_dir, img_file.filename)
            img_file.save(img_path)

            # Read the saved image
            img_array = cv2.imread(img_path, cv2.IMREAD_COLOR)

            ela_image = error_level_analysis(img_array)
            if ela_image is None:
                return jsonify({'error': 'Error processing the image'})

            image_arr = [preprocess_image(ela_image)]
            prediction = model.signatures["serving_default"](inputs=tf.constant(image_arr))['output_0']
            result = 1 if prediction[0][0] > 0.5 else 0
            print(f"RESULT : {result}")

            res = {'prediction': result}
            response = jsonify(res)
            return response

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred during prediction'})


if __name__ == '__main__':
    app.run(debug=True)
