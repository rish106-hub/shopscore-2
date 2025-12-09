import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

const Admin = () => {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    stock: 0,
    rating: 0,
    price: 0,
    reviews: []
  })

  const API_URL = import.meta.env.VITE_API_URL

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [API_URL])

  useEffect(() => {
    if (!isAdmin()) return
    fetchProducts()
  }, [fetchProducts])

  const handleChange = (e) => {
    const { name, value } = e.target
    const numericFields = ['stock', 'price', 'rating']
    const parsedValue = numericFields.includes(name)
      ? (name === 'stock' ? parseInt(value || 0, 10) : parseFloat(value || 0))
      : value
    setFormData({ ...formData, [name]: Number.isNaN(parsedValue) ? 0 : parsedValue })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingProduct ? `${API_URL}/products/${editingProduct._id}` : `${API_URL}/products`
    const method = editingProduct ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchProducts()
        setShowModal(false)
        setEditingProduct(null)
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          stock: 0,
          rating: 0,
          price: 0,
          reviews: []
        })
      } else {
        alert('Error saving product')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      rating: typeof product.rating === 'number' ? product.rating : 0,
      price: product.price,
      reviews: product.reviews
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        fetchProducts()
      } else {
        alert('Error deleting product')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      stock: 0,
      rating: 0,
      price: 0,
      reviews: []
    })
    setShowModal(true)
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/50 border border-red-500/50 rounded-xl p-8 text-center">
          <p className="text-red-400 text-2xl font-bold">⚠️ Access Denied</p>
          <p className="text-gray-300 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all">
            ShopScore
          </Link>
          <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
            ← Back to Store
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">🛠️</span>
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your products and inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-yellow-400 text-sm font-semibold mb-1">Total Products</p>
            <p className="text-white text-3xl font-bold">{products.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
            <p className="text-green-400 text-sm font-semibold mb-1">In Stock</p>
            <p className="text-white text-3xl font-bold">
              {products.filter(p => p.stock > 0).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <p className="text-blue-400 text-sm font-semibold mb-1">Total Reviews</p>
            <p className="text-white text-3xl font-bold">
              {products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* Add Product Button */}
        <button
          onClick={openAddModal}
          className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 mb-8 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Product
        </button>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all">
              <div className="aspect-square bg-gray-900 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Price</p>
                    <p className="text-white font-bold text-lg">${product.price}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Stock</p>
                    <p className={`font-bold text-lg ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <p className="text-gray-500 text-xs mb-1">Reviews</p>
                  <p className="text-yellow-400 font-semibold">
                    {product.reviews?.length || 0} customer reviews
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <p className="text-gray-500 text-xs mb-1">Rating</p>
                  <p className="text-yellow-400 font-semibold">
                    {typeof product.rating === 'number' ? product.rating.toFixed(1) : '0.0'} / 5
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition-all font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500/20 text-red-400 border border-red-500/50 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 bg-gray-800/30 border border-gray-700 rounded-xl">
            <p className="text-gray-400 text-xl mb-4">No products yet</p>
            <p className="text-gray-500">Click "Add New Product" to get started</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-b border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-yellow-400">
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-24 resize-none"
                  placeholder="Describe the product"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Rating (0 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-yellow-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p className="text-lg mb-2">
            <span className="text-yellow-400 font-bold">ShopScore</span> - Admin Dashboard
          </p>
          <p className="text-sm">© 2025 ShopScore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Admin