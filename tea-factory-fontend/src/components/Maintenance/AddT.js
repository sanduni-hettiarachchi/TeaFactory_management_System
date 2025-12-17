import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Navbar'
import Sidebar from '../SideBars'

function AddT() {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract maintenance ID from URL
  const queryParams = new URLSearchParams(location.search)
  const maintenanceId = queryParams.get('id')

  const [formData, setFormData] = useState({
    techname: "",
    machinename: "",
    adate: "",
    issue: "",
    edate: ""
  })

  const [technicians, setTechnicians] = useState([]) // store technician list

  // Fetch technician list
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Technician', {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        if (response.status === 200) {
          // only show technicians who are available and not assigned
          const availableTechs = response.data.technicians.filter(
            (t) => t.availability === "available" && t.work === "not-assigned"
          )
          setTechnicians(availableTechs)
        }
      } catch (error) {
        console.error("Error fetching technicians:", error.response ? error.response.data : error.message)
      }
    }
    fetchTechnicians()
  }, [])

  // Fetch maintenance details if id is provided
  useEffect(() => {
    const fetchMaintenance = async () => {
      if (!maintenanceId) return
      try {
        const response = await axios.get(`http://localhost:3001/Maintenance/${maintenanceId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        })

        if (response.status === 200) {
          const m = response.data.maintenance
          // Auto-fill machine name and issue
          setFormData(prev => ({
            ...prev,
            machinename: m.machineName || "",
            issue: m.description || ""
          }))
        }
      } catch (error) {
        console.error("Error fetching maintenance details:", error.response ? error.response.data : error.message)
      }
    }

    fetchMaintenance()
  }, [maintenanceId])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3001/Assign", formData, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      })
      navigate("/MainDashboard/maintenance")
    } catch (error) {
      console.error("Error saving assign:", error.response ? error.response.data : error.message)
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Form */}
        <div className="flex justify-center items-center flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Add Technician Assignment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Technician Name (Dropdown) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Technician Name</label>
                <select
                  name="techname"
                  value={formData.techname}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">-- Select Technician --</option>
                  {technicians.length > 0 ? (
                    technicians.map((t) => (
                      <option key={t._id} value={t.name}>
                        {t.name} ({t.specialty})
                      </option>
                    ))
                  ) : (
                    <option disabled>No available technicians</option>
                  )}
                </select>
              </div>

              {/* Machine Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Machine Name</label>
                <input
                  type="text"
                  name="machinename"
                  value={formData.machinename}
                  readOnly
                  pattern="^[A-Za-z0-9\\s]{2,20}$"
                  title="Machine name can contain letters, numbers, and spaces (2–20 characters)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Assign Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Assign Date</label>
                <input
                  type="date"
                  name="adate"
                  value={formData.adate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Issue */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Issue</label>
                <input
                  type="text"
                  name="issue"
                  value={formData.issue}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Maintenance End Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Maintenance End Date</label>
                <input
                  type="date"
                  name="edate"
                  value={formData.edate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Assign
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddT