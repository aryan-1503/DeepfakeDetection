import mongoose, { Schema,model } from "mongoose";

const PredictionSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    }
})

const PredictionModel = model("Prediction",PredictionSchema,"predictions");

export { PredictionModel }