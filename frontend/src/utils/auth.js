import { jwtDecode } from 'jwt-decode'

export const getUserFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch (error) {
    return null
  }
}

export const isAdmin = () => {
  const user = getUserFromToken()
  return user && user.role === 'admin'
}