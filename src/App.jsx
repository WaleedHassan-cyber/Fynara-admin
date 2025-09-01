import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <>
    <div>
      <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> could show login prompt or welcome */}
        <Route path="/" element={<ProtectedRoute type="public"><Login /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute type="protected"><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
    
     
    </div>
    </>
  )
}

export default App
