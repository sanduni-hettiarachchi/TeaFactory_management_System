import React from 'react'
//import { useAuth } from '../contexs/AuthContext';
import AdminSidebar from '../Dashboard/AdminSidebar';
import Navbar from '../Dashboard/Navbar';
//import AdminSummary from '../Dashboard/AdminSummary';
import { Outlet } from 'react-router-dom';



const AdminDashboard = () => {

  return (
    <div>
      <AdminSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard