import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import AttendanceHelper, { columns } from '../../utills/AttendanceHelper'

const Attendence = () => {

  const [attendance, setAttendance] = useState([])
  const [Loading, setLoarding] = useState(false)
  const [filterAttendance, setFilterAttendance] = useState([])

  const statusChange = () => {
    fetchAttendance();
  }

  const fetchAttendance = async () => {
    setLoarding(true)
    try {
      const response = await axios.get("http://localhost:3001/api/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        let sno = 1;
        const data = await response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange} />,
        }));
        setAttendance(data);
        setFilterAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    } finally {
      setLoarding(false)
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const record = attendance.filter((emp) => (
      emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilterAttendance(record)
  }

  return (
    <>
      {Loading ? (
        <div className='text-center text-lg font-medium text-gray-600'>Loading...</div>
      ) : (
        <div className='p-6 bg-gray-50 min-h-screen'>
          <div className='text-center mb-6'>
            <h3 className='text-3xl font-extrabold text-gray-800'>Manage Attendance</h3>
          </div>

          <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-md p-4 rounded-lg'>
            <input
              type="text"
              placeholder='Search By Emp ID'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none w-full md:w-1/3'
              onChange={handleFilter}
            />
            <p className='text-lg md:text-xl font-medium text-gray-700'>
              Mark Employees for{" "}
              <span className='font-bold underline text-green-600'>
                {new Date().toISOString().split("T")[0]}
              </span>
            </p>
            <Link
              to="/admin-dashboard/attendence-report"
              className='px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold shadow-md transition'
            >
              Attendance Report
            </Link>
          </div>

          <div className='mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-200'>
            <DataTable
              columns={columns}
              data={filterAttendance}
              pagination
              highlightOnHover
              striped
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Attendence
