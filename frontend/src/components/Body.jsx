import React, {useContext, useEffect, useState} from 'react';
import Demo from '../img/demo4.png';
import Real from './Real.jsx';
import Fake from './Fake.jsx';
import '../styles/Body.css';
import axios from 'axios';
import AuthContext from "../AuthContext/AuthContext.jsx";
import toast, {Toaster} from "react-hot-toast";

const Body = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPrediction, setIsPrediction] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (isPrediction) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'instant',
            });
        }
    }, [isPrediction]);

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            console.log(uploadedFile.name);
            toast.success("Image Uploaded! Continue with detection",{
                style: {
                    fontSize: "15px"
                }
            })
        }
    };
    useEffect(() => {
        console.log("FROM BODY : ",user)
    }, [user]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('http://localhost:7000/api/v2/prediction/add-prediction', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            console.log("RES",response.data.prediction);
            
            setResult(response.data.prediction);
            setIsPrediction(true);
            console.log("RESULT: ",result)

        } catch (e) {
            setError("Something went wrong");
            console.log(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="body-wrapper">
                <div className="body-container">
                    <div className="info">
                        <div className="i1">Upload an image to check if it's fake</div>
                        <div className="i2">You can upload an image to check whether if it's real or AI-generated!</div>
                    </div>
                    <div className="image">
                        <img src={Demo} alt="" width="500px" height="550px" />
                    </div>
                    <div className="form-wrapper">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="image-upload">
                                <input type="file" accept="image/*" id="image-upload" onChange={handleFileUpload} style={{ display: "none" }} />
                                <span id="upload">Upload</span>
                            </label>
                            <button type="submit" id="detect-btn" disabled={!file || loading}>
                                {loading ? "Detecting..." : "Detect"}
                            </button>
                        </form>
                    </div>
                    <div className="result">
                        {isPrediction && (result === "1" ? <Fake /> : <Real />)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Body;
