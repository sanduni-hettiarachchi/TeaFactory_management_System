import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexs/AuthContext'

const LeaveList = () => {
  const [leaves, setLeaves] = useState([])
  let sno = 1
  const { id } = useParams()
  const { admin } = useAuth()

  const fetchLeaves = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/leave/${id}/${admin.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.data.success) {
        setLeaves(response.data.leaves)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message)
      }
    }
  }, [id, admin.role])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Manage Leaves</h3>
      </div>

      {/* Search + Button */}
      <div className="flex justify-between items-center mt-6">
        <input
          type="text"
          placeholder="Search by employee name"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none w-64"
        />
        {admin.role === 'employee' && (
          <Link
            to="/emp-dashboard/add-leave"
            className="px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-700 transition"
          >
            Add New Leave
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-md overflow-hidden shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">SNO</th>
              <th className="px-6 py-3">Leave Type</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{sno++}</td>
                  <td className="px-6 py-3">{leave.leaveType}</td>
                  <td className="px-6 py-3">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{leave.reason}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={leave.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No leaves found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 🔹 Badge Component
const StatusBadge = ({ status }) => {
  let classes =
    'px-3 py-1 rounded-full text-xs font-semibold inline-block '

  switch (status?.toLowerCase()) {
    case 'approved':
      classes += 'bg-green-100 text-green-700'
      break
    case 'pending':
      classes += 'bg-yellow-100 text-yellow-700'
      break
    case 'rejected':
      classes += 'bg-red-100 text-red-700'
      break
    default:
      classes += 'bg-gray-100 text-gray-600'
  }

  return <span className={classes}>{status}</span>
}

export default LeaveList
