import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers} from 'react-icons/fa'
import '../output.css';
import { useAuth } from '../contexs/AuthContext';

const EmpSidebar = () => {
    const {admin} = useAuth()
  return (
    <div className="bg-green-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-green-800 h-12 flex items-center justify-center">
        <h3 className='text-2xl text-center'>Employee MS</h3>
      </div>
      <div className='px=4'>
        <NavLink to="/emp-dashboard"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}
          end
          >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to={`/emp-dashboard/profile/${admin._id}`}
           className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}
          >
          <FaUsers />
          <span>My Profile</span>
        </NavLink>
        <NavLink to={`/emp-dashboard/leaves/${admin._id}`}
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaBuilding />
          <span>Leaves</span>
        </NavLink>
        <NavLink to={`/emp-dashboard/salary/${admin._id}`}
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>
        <NavLink to="/emp-dashboard/setting"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaCogs />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
    
  )
}

export default EmpSidebar