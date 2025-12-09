import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Auth = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'normal'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password, role: formData.role }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.accessToken)
          alert('Login successful! Welcome to ShopScore!')
          navigate('/')
        } else {
          alert('Registration successful! Please login.')
          setIsLogin(true)
        }
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all">
              ShopScore
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Your trusted product review platform</p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-b border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 text-center">
              {isLogin ? '🔐 Welcome Back' : '✨ Create Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="px-8 pb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/50 text-gray-400">or</span>
              </div>
            </div>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full bg-gray-700 text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>

            <Link
              to="/"
              className="block text-center text-gray-400 hover:text-yellow-400 mt-4 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By continuing, you agree to ShopScore's Terms of Service
        </p>
      </div>
    </div>
  )
}

export default Auth