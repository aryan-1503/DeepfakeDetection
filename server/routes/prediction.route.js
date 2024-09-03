import express from 'express';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import { PredictionModel } from '../models/prediction.model.js';
import { UserModel } from '../models/user.model.js';
import jwt from "jsonwebtoken";

const predictionRouter = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

predictionRouter.post('/add-prediction', upload.single('image'), async (req, res) => {
    const { token } = req.cookies
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const predictionResponse = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const predictionResult = predictionResponse.data.prediction;

        const prediction = new PredictionModel({
            image: req.file.path,
            result: predictionResult,
        });

        await prediction.save();
        const data = jwt.verify(token,process.env.SECRET);
        const id = data.id

        const user = await UserModel.findById(id);
        user.predictions.push(prediction._id);
        await user.save();

        res.json({ prediction,user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

predictionRouter.get('/user-predictions', async (req, res) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const data = jwt.verify(token, process.env.SECRET);
        const userId = data.id;

        const user = await UserModel.findById(userId).populate('predictions');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.predictions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

export { predictionRouter };
