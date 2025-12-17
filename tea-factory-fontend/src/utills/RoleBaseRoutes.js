import React from 'react'
import { useAuth } from '../contexs/AuthContext'
import { Navigate } from 'react-router-dom'

const RoleBaseRoutes = ({children, requiredRole}) => {
    const {admin, loading} = useAuth()

    if(loading){
        return <div>Loading...</div>
    }

    if(!requiredRole.includes(admin.role)){
        <Navigate to="/unothorized" />
    }
  
    return admin ? children : <Navigate to="/login" />
}

export default RoleBaseRoutes