import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

const ProtectedAdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/auth" />
}

export default ProtectedAdminRoute