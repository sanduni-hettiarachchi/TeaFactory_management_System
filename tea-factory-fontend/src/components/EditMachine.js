import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import Sidebar from './SideBars'

function EditMachine() {
  const { id } = useParams()
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setMachine(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:3001/Machine/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          setMachine(response.data.Machines)
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message)
        alert(error.response?.data?.message || "Error fetching machine")
      } finally {
        setLoading(false)
      }
    }
    fetchMachines()
  }, [id])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading ...</div>
  }

  if (!machine) {
    return <div className="flex justify-center items-center h-screen">Machine not found</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting machine:", machine)
    try {
      const response = await axios.put(`http://localhost:3001/Machine/${id}`, machine, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })

      console.log("Server response:", response)

      if (response.status === 200) {
        navigate("/MainDashboard/machines")
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message)
      alert(error.response?.data?.message || "Error updating machine")
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Form */}
        <div className="flex justify-center items-center flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Edit Machine
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Machine Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Machine Name</label>
                <input
                  type="text"
                  name="name"
                  value={machine.name}
                  onChange={handleChange}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Machine Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Machine Type</label>
                <input
                  type="text"
                  name="type"
                  value={machine.type}
                  onChange={handleChange}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Machine Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Machine Location</label>
                <select
                  name="location"
                  value={machine.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="" disabled>-- Select Location --</option>
                  <option value="floor 1">floor 1</option>
                  <option value="floor 2">floor 2</option>
                  <option value="floor 3">floor 3</option>
                </select>
              </div>

              {/* Machine Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Machine Status</label>
                <select
                  name="status"
                  value={machine.status}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="" disabled>-- Select Status --</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="under-maintenance">under Maintenance</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Update Machine
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMachine