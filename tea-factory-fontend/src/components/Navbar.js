import React from 'react'
import '../output.css'

function Navbar() {
  return (
    <div className="flex items-center justify-between bg-green-600 px-6 py-3 shadow-md">
      <h4 className="text-white text-lg font-semibold">
        Welcome, Maintenance Manager
      </h4>
      <button className="bg-white text-green-600 font-medium px-4 py-2 rounded-lg hover:bg-green-100 transition">
        Logout
      </button>
    </div>
  )
}

export default Navbar