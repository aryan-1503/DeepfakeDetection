import express, {urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDB } from './utils/connectToDB.js';
import { authRouter } from './routes/auth.route.js';
import { predictionRouter } from './routes/prediction.route.js';

console.log('Welcome to Deepfake Detection Server');
const app = express();
await connectToDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(urlencoded({ extended:false }))
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

const PORT = process.env.PORT || 8000;

app.use('/api/v2/auth', authRouter);
app.use('/api/v2/prediction', predictionRouter);

app.get('/', (req, res) => {
    res.send('HELLO WORLD');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
