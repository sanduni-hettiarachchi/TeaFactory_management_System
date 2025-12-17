import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

// Ensure context exists
const userContext = createContext()

const AuthContext = ({ children }) => {
  const [admin, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Skip server verification when using dev bypass token
          if (token === 'DEV_BYPASS') {
            setUser((prev) => prev || { role: 'bypass', name: 'Bypass User' })
            setLoading(false)
            return
          }
          const response = await axios.get('http://localhost:3001/api/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.data.success) {
            setUser(response.data.admin)
          }
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        if (error.response) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    verifyUser()
  }, [])

  const login = (admin) => {
    setUser(admin)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <userContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)
export default AuthContext