import React from 'react';
import '../styles/Header.css'
import { PiDetectiveFill } from "react-icons/pi";
const Header = () => {
    return (
        <>
            <div className="nav-bar">
                <div className="header-name">
                    <PiDetectiveFill id="icon"/>
                    DeepFake Detection
                </div>
                <div className="nav-btns">
                    <button id="btn1">How it works</button>
                    <button>About us</button>
                    <button id="sign-up">Sign up</button>
                    <button>Login</button>
                </div>
            </div>
            <hr/>
        </>
    );
};

export default Header;