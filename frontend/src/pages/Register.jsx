import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import "../styles/Register.css"
import axios from "axios";
import Loading from "../components/Loading.jsx";
import toast, {Toaster} from "react-hot-toast";
const Register = () => {
    const [formData,setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData,[name] : value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const { confirmPassword, ...data } = formData;
        console.log(data);
        try{
            setLoading(true);
            const res = await axios.post("http://localhost:7000/api/v2/auth/register",data);
            console.log("RESPONSE : ",res.data);
            navigate("/login")
            toast.success(res.data.message,{
                position: "top-center",
                style: {
                    fontSize: "15px"
                }
            })
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className="register-wrapper">
            <Toaster />
            <div className="register-container">
                <div className="title">
                    Register
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            id="confirm-password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            {loading ? <div style={{display:"grid",placeItems:"center"}}><Loading /></div> : "Register"}
                        </button>
                    </form>
                    <div className="toggle-login">
                        Already registered ?
                        <Link to="/login" style={{paddingLeft:"0.5rem",color:"#deb823"}}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;