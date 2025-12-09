import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const [products, setProducts] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const API_URL = import.meta.env.VITE_API_URL
  const sliderRef = useRef(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 5))
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [products])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const featuredProducts = products.slice(0, 5)
  const filteredProducts = products.filter(
    (p) => (typeof p.rating === 'number' ? p.rating : 0) >= minRating
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all">
              ShopScore
            </Link>
            <div className="flex items-center gap-4">
              {token ? (
                <>
                  <Link to="/admin" className="text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2">
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">ShopScore</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing products and share your honest reviews with our community
          </p>
        </div>
      </div>

      {/* Featured Products Slider */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center">
            <span className="mr-3">⭐</span>
            Featured Products
          </h2>
          <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 border border-yellow-500/20">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product._id} className="min-w-full flex flex-col md:flex-row items-center p-8 md:p-12">
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    <h3 className="text-4xl font-bold text-yellow-400 mb-4">{product.name}</h3>
                    <p className="text-gray-300 text-lg mb-6">{product.description}</p>
                    <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                      <span className="text-3xl font-bold text-white">${product.price}</span>
                      <span className="text-gray-400">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      className="inline-block bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      View Details & Reviews
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-yellow-500 w-8' : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center">
          <span className="mr-3">🛍️</span>
          All Products
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-300">Minimum Rating:</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value || 0))}
            className="w-32 p-2 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
          />
          <span className="text-gray-500">/ 5</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden bg-gray-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl font-bold text-white">${product.price}</span>
                  <span className="text-sm text-gray-500">
                    {product.reviews?.length || 0} reviews
                  </span>
                </div>
                <div className="text-sm text-yellow-400 font-semibold">
                  ⭐ {typeof product.rating === 'number' ? product.rating.toFixed(1) : '0.0'} / 5
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No products available yet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-yellow-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p className="text-lg mb-2">
            <span className="text-yellow-400 font-bold">ShopScore</span> - Your trusted product review platform
          </p>
          <p className="text-sm">© 2025 ShopScore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home