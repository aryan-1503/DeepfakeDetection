import { useState } from 'react'
import './App.css'
import Header from "./components/Header.jsx";
import Body from "./components/Body.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="header">
          <Header/>
      </div>
      <div className="body">
          <Body/>
      </div>

    </>
  )
}

export default App
App.js
// import React, { useState } from 'react';
// import './App.css';
//
// function App() {
//     const [file, setFile] = useState(null);
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
//
//     const handleSubmit = async () => {
//         if (!file) {
//             alert('Please select a file.');
//             return;
//         }
//
//         setLoading(true);
//
//         // Here you would make an API call to your deepfake detection backend
//         // For demonstration purposes, I'm simulating a delay using setTimeout
//         setTimeout(() => {
//             // Simulating detection result
//             const isDeepfake = Math.random() < 0.5; // 50% chance of being a deepfake
//             setResult(isDeepfake ? 'Fake' : 'Real');
//             setLoading(false);
//         }, 2000);
//     };
//
//     return (
//         <div className="App">
//             <h1>Deepfake Detection</h1>
//             <label className="file-upload">
//                 <input type="file" accept="image/*, video/*" onChange={handleFileChange} />
//                 <span>Choose File</span>
//             </label>
//             <button className="detect-btn" onClick={handleSubmit} disabled={!file || loading}>
//                 {loading ? 'Detecting...' : 'Detect'}
//             </button>
//             {result && <p className={result === 'Fake' ? 'fake' : 'real'}>{`Result: ${result}`}</p>}
//         </div>
//     );
// }
//
// export default App;
