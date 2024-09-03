import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import AuthContext from '../AuthContext/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import "../styles/Predictions.css"

const   Predictions = () => {
    const [predictions, setPredictions] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:7000/api/v2/prediction/user-predictions', {
                    withCredentials: true,
                });
                setPredictions(response.data);
            } catch (error) {
                console.error('Error fetching predictions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPredictions();
        }
    }, [user]);

    return (
        <>
            <Header />
            <div className="predictions-wrapper">
                <div className="prediction-container">
                    {loading ? (
                        <div style={{ display: "grid", placeItems: "center" }}><Loading /></div>
                    ) : (
                        predictions.length === 0 ? (
                            <h2>No predictions available</h2>
                        ) : (
                            predictions.map((prediction) => (
                                <div key={prediction._id} className="prediction-card">
                                    <img src={`http://localhost:7000/${prediction.image}`} alt={prediction.image} style={{width:"250px",height:"250px"}} />
                                    <p>{prediction.result === "0" ? <p id="real">REAL</p> : <p id="fake">FAKE</p>}</p>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default Predictions;
