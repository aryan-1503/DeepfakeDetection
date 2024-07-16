import React from 'react';
import "../styles/Loading.css"

const Loading = () => {
    return (
        <div className="loader">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
        </div>
    );
};

export default Loading;