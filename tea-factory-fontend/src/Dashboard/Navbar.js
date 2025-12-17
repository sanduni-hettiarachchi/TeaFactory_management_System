import React from 'react'
import { useAuth } from '../contexs/AuthContext'

const Navbar = () => {
    const {admin, logout} = useAuth()
  return (
    <div className='flex items-center text-white justify-between h-12 bg-green-700 px-5'>
        <p className=''>Welcome {admin.name}</p>
        <button className='px-4 py-1 bg-teal-700 hover:bg-green-500' onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar