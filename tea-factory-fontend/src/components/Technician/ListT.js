import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, TechnicianButtons } from './TechHelp'
import axios from 'axios'
import SideBar from '../SideBars'
import Navbar from '../Navbar'

// ...imports remain the same
function ListT() {
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchAvailability, setSearchAvailability] = useState('') // '' = All

  const onTechnicianDelete = useCallback((id) => {
    setTechnician(prev => prev.filter(technician => technician._id !== id))
  }, [])

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('http://localhost:3001/Technician', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.status === 200) {
          let sno = 1
          const data = response.data.technicians.map((technician) => ({
            _id: technician._id,
            sno: sno++,
            name: technician.name,
            email: technician.email,
            phone: technician.phone,
            specialty: technician.specialty,
            availability: technician.availability?.trim() || 'Unknown', // trim spaces
            work: technician.work,
            action: (<TechnicianButtons id={technician._id} onTechnicianDelete={onTechnicianDelete} />)
          }))
          setTechnician(data)
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message)
        if (error.code === 'ECONNREFUSED') {
          setError("Cannot connect to server. Make sure the backend is running on port 5000.")
        } else {
          setError(error.response?.data?.message || "Error fetching technician")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTechnician()
  }, [onTechnicianDelete])

  if (loading) return <div className="p-6 ml-64 mt-12">Loading technician...</div>
  if (error) return (
    <div className="p-6 ml-64 mt-12">
      <div className="text-red-600 font-medium">{error}</div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  )

  // Fixed filter: exact match after trimming & lowercasing
  const filteredTechnicians = technician?.filter((tech) => {
    if (!searchAvailability) return true // show all if no filter
    return tech.availability?.trim().toLowerCase() === searchAvailability.trim().toLowerCase()
  })

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        <Navbar />

        <div className="p-6 mt-12">
          {/* Header */}
          <div className="text-center mt-4">
            <h3 className="text-2xl font-bold text-gray-800">Manage Technicians</h3>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            {/* Dropdown filter for availability */}
            <select
              value={searchAvailability}
              onChange={(e) => setSearchAvailability(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-md w-64"
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>

            <Link
              to="/home/new-technician"
              className="py-2 px-4 bg-teal-600 rounded-md text-white font-medium hover:bg-teal-700 transition"
            >
              Add New Technician
            </Link>
          </div>

          {/* Table */}
          <div className="mt-6 bg-white/90 rounded-md shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-gray-200 p-3 text-lg bg-green-500 font-semibold text-white"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTechnicians && filteredTechnicians.length > 0 ? (
                  filteredTechnicians.map((row, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-gray-200 p-3 text-center text-lg"
                        >
                          {column.selector(row)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="border border-gray-200 p-6 text-center text-gray-500">
                      {searchAvailability ? `No technicians found with availability "${searchAvailability}"` : 'No technicians available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListT