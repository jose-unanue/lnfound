import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Report from './pages/Report'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Claims from './pages/Claim'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Navbar />
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/claims" element={<Claims />} />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
