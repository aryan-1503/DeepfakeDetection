import cv2
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from flask_cors import CORS

# Load the TensorFlow model
model = tf.saved_model.load("saved_model/my_model")

# Initialize Flask app
app = Flask(__name__)
CORS(app)


def error_level_analysis(image, quality_val=90):
    try:
        # Resize early to reduce memory usage
        resized_image = cv2.resize(image, (224, 224))

        _, encoded_img = cv2.imencode('.jpg', resized_image, [cv2.IMWRITE_JPEG_QUALITY, quality_val])
        decoded_img = cv2.imdecode(encoded_img, cv2.IMREAD_UNCHANGED)

        ela_image = np.abs(resized_image.astype(np.float32) - decoded_img.astype(np.float32))
        del resized_image, encoded_img, decoded_img  # Free memory
        return ela_image
    except Exception as e:
        print("Error in error_level_analysis:", e)
        return None


def preprocess_image(image):
    try:
        # Assuming image is already resized to (224, 224) in error_level_analysis
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_array = np.array(image_rgb)
        del image_rgb  # Free memory
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
            # Read the image directly from the uploaded file
            file_stream = img_file.read()
            np_img = np.frombuffer(file_stream, np.uint8)
            img_array = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
            del np_img, file_stream  # Free memory

            ela_image = error_level_analysis(img_array)
            if ela_image is None:
                return jsonify({'error': 'Error processing the image'})

            image_arr = np.expand_dims(preprocess_image(ela_image), axis=0)  # Ensure batch size is 1
            del ela_image  # Free memory

            prediction = model.signatures["serving_default"](inputs=tf.constant(image_arr))['output_0']
            result = int(prediction[0][0] > 0.5)
            print(f"RESULT : {result}")

            del image_arr, prediction  # Free memory

            res = {'prediction': result}
            return jsonify(res)

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred during prediction'})


