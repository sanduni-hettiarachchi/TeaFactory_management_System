import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import Navbar from '../Navbar'
import Sidebar from '../SideBars'

function AddMachines() {
  const [machine, setMachine] = useState({
    name: '',
    type: '',
    location: '',
    status: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setMachine({ ...machine, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting machine:", machine)
    try {
      const response = await axios.post('http://localhost:3001/Machine', machine, {
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
      alert(error.response?.data?.message || "Error adding machine")
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Form container */}
        <div className="flex justify-center items-center flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Add New Machine
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Machine Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Machine Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                  pattern="^[A-Za-z0-9]{1,10}$"
                  title="Machine name can only contain letters and numbers (no spaces, max 10 characters)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Machine Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Machine Type
                </label>
                <input
                  type="text"
                  name="type"
                  onChange={handleChange}
                  required
                  pattern="^[A-Za-z\s]{2,10}$"
                  title="Name should contain only letters and spaces (2-10 characters)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Machine Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Machine Location
                </label>
                <select
                  name="location"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">-- Select Location --</option>
                  <option value="floor 1">floor 1</option>
                  <option value="floor 2">floor 2</option>
                  <option value="floor 3">floor 3</option>
                </select>
              </div>

              {/* Machine Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Machine Status
                </label>
                <select
                  name="status"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">-- Select Status --</option>
                  <option value="active">active</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Add Machine
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMachines