import './App.css'
import Header from "./components/Header.jsx";
import Body from "./components/Body.jsx";
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Predictions from "./pages/Predictions.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import {useState} from "react";
import AuthContext from "./AuthContext/AuthContext.jsx";

function App() {
    const [user, setUser] = useState(null);
    const values = { user,setUser};

  return (
      <AuthContext.Provider value={values}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<h1 style={{textAlign:"center"}}>Page Not Found</h1>} />
              </Routes>
          </BrowserRouter>
      </AuthContext.Provider>

  )
}

export default App
