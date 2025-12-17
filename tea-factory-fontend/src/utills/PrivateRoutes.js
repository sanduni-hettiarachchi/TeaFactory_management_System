import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexs/AuthContext'

const PrivateRoutes = ({children}) => {
  const {admin, loading} = useAuth()

  if(loading){
    return <div>Loading....</div>
  }

  return admin ? children : <Navigate to="/login" />
}

export default PrivateRoutes