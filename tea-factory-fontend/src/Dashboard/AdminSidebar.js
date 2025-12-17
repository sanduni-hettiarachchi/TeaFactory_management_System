import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding, FaCalendar, FaMoneyBillWave, FaRegCalendarAlt, FaTachometerAlt, FaUsers} from 'react-icons/fa'
import {AiOutlineFileText} from 'react-icons/ai'
import '../output.css';

const AdminSidebar = () => {
  return (
    <div className="bg-green-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-green-800 h-12 flex items-center justify-center">
        <h3 className='text-2xl text-center'>Employee MS</h3>
      </div>
      <div className='px=4'>
        <NavLink to="/admin-dashboard"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}
          end
          >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin-dashboard/employees"
           className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}
          >
          <FaUsers />
          <span>Employees</span>
        </NavLink>
        <NavLink to="/admin-dashboard/departments"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaBuilding />
          <span>Department</span>
        </NavLink>
        <NavLink to="/admin-dashboard/leaves"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaCalendar />
          <span>Leave</span>
        </NavLink>
        <NavLink to="/admin-dashboard/salary"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>
        <NavLink to="/admin-dashboard/attendence"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaRegCalendarAlt />
          <span>Attendence</span>
        </NavLink>
        <NavLink to="/admin-dashboard/attendence-report"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <AiOutlineFileText />
          <span>Attendence Report</span>
        </NavLink>
        <NavLink to="/admin-dashboard/supplier"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
            <FaUsers />
          <span>Suppliers</span>
        </NavLink>
        <NavLink to="/admin-dashboard/customer"
          className={({isActive})=> `${isActive ? " bg-green-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
          <FaUsers />
          <span>Customers</span>
        </NavLink>
      </div>
    </div>
    
  )
}

export default AdminSidebar