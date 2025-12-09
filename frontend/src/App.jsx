import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Auth from './components/Auth'
import Admin from './components/Admin'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import Home from './components/Home'
import ProductDetail from './components/ProductDetail'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
