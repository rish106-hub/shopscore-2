import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(5)
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }, [API_URL, id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!token) {
      alert('Please login to add a review')
      return
    }
    try {
      const response = await fetch(`${API_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ review })
      })
      if (response.ok) {
        setReview('')
        setRating(5)
        fetchProduct()
      } else {
        alert('Error adding review')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getUserRole = () => {
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded.role
    } catch (error) {
      return null
    }
  }

  const userRole = getUserRole()

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-opacity-75 mx-auto mb-4"></div>
          <p className="text-gray-300 text-xl">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all">
            ShopScore
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors group">
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Products
        </Link>

        {/* Product Details Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-bold text-yellow-400">${product.price}</span>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-3 mb-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Rating</p>
                <p className="text-yellow-400 font-bold text-xl">
                  {typeof product.rating === 'number' ? product.rating.toFixed(1) : '0.0'} / 5
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Description</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Customer Reviews</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {product.reviews?.length || 0} {product.reviews?.length === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
              </div>

              {!token && (
                <Link
                  to="/auth"
                  className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all text-center transform hover:scale-105"
                >
                  Login to Add Review
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center">
            <span className="mr-3">💬</span>
            Customer Reviews
          </h2>

          {/* Review Form */}
          {token && userRole === 'normal' && (
            <form onSubmit={handleAddReview} className="bg-gray-900/50 border border-gray-600 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Write Your Review</h3>
              
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                required
                className="w-full p-4 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-32 mb-4 resize-none"
              />
              
              <button
                type="submit"
                className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-600 rounded-xl p-6 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                      {rev.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-400">{rev.user}</p>
                      <p className="text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{rev.review}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-2">No reviews yet</p>
                <p className="text-gray-500">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
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

export default ProductDetail