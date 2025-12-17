import React from 'react'
import EmpSidebar from '../EmployeeDashboard/EmpSidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../Dashboard/Navbar'

const EmpDashboard = () => {
  return (
    <div>
      <EmpSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default EmpDashboard