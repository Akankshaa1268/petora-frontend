import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import HumanCare from './components/HumanCare'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/human-care" element={<HumanCare />} />
      </Routes>
    </div>
  )
}

export default App
