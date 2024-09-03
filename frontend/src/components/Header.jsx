import React, {useContext, useEffect} from 'react';
import '../styles/Header.css'
import { PiDetectiveFill } from "react-icons/pi";
import {useNavigate} from "react-router-dom";
import AuthContext from "../AuthContext/AuthContext.jsx";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
const Header = () => {
    const navigate = useNavigate()
    const {user,setUser} = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const res = await axios.get("http://localhost:7000/api/v2/auth/me",{
                    withCredentials: true
                });
                setUser(res.data.user);

            }catch (error) {
                console.log("Error fetching user data : ",error);
            }
        }
        fetchUserData()
    }, []);

    const handleLogout = async () => {
        try{
            const res = await axios.post("http://localhost:7000/api/v2/auth/logout",{},{withCredentials :true})
            if (res.status === 200) {
                // alert(res.data.message)
                toast.success(res.data.message,{
                    position: "top-center",
                    style: {
                        fontSize: "15px"
                    }
                })
                setUser(null);
                navigate("/")
            }
        }catch (e) {
            console.log(e.message)
        }
    }
    return (
        <>
            <div className="nav-bar">
                <Toaster />
                <div className="header-name">
                    <PiDetectiveFill id="icon"/>
                    DeepFake Detection
                </div>
                <div className="nav-btns">
                    <button>About us</button>
                    {user ? (
                        <>
                            <button id="btn1" onClick={() => navigate("/predictions")}>My Predictions</button>
                            <button className="profile" onClick={() => navigate("/")}>Hii,{user.username}</button>
                            <button onClick={handleLogout}>Logout</button>

                        </>

                    ) : (
                        <>
                            <button id="btn1" onClick={() => navigate("/predictions")}>How it works</button>
                            <button id="sign-up" onClick={() => navigate("/register")}>Sign up</button>
                            <button onClick={() => navigate("/login")}>Login</button>
                        </>
                    )}

                </div>
            </div>
            <hr/>
        </>
    );
};

export default Header;