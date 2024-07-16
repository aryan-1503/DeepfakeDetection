import {Link, useNavigate} from "react-router-dom";
import "../styles/Register.css"
import {useState} from "react";
import axios from "axios";
import Loading from "../components/Loading.jsx";
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const [formData,setFormData] = useState({
        email: "",
        password: ""
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
        try{
            setLoading(true)

            const res = await axios.post("http://localhost:7000/api/v2/auth/login",formData,{withCredentials: true});
            toast.success(res.data.message,{
                position: "top-center",
                style: {
                    fontSize: "15px"
                }
            })
            console.log(res.data)
            // alert(res.data.message)

            navigate("/");

        }catch (error) {
            console.log(error);
            alert(error.message)
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
                    Login
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit">
                            {loading ? <div style={{display:"grid",placeItems:"center"}}><Loading /></div> : "Log in"}
                        </button>

                    </form>
                    <div className="toggle-login">
                        Not yet registered ?
                        <Link to="/register" style={{paddingLeft:"0.5rem",color:"#deb823"}}>Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;