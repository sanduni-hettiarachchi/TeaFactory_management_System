import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Navbar'
import Sidebar from '../SideBars'

function EditT() {
    const { id } = useParams()
    const [technician, setTechnician] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: '',
        availability: '',
        work:'' 
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setTechnician(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        if (!id) {
            console.error("Invalid ID from URL:", id)
            alert("Invalid technician ID")
            return
        }
        const fetchTechnician = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://localhost:3001/Technician/${id}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
                })
                if (response.status === 200) {
                    setTechnician(response.data.technician)
                }
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message)
                alert(error.response?.data?.message || "Error fetching technician")
            } finally {
                setLoading(false)
            }
        }
        fetchTechnician()
    }, [id])

    if (loading) return <div>Loading ...</div>
    if (!technician) return <div>Technician not found</div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3001/Technician/${id}`, technician, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) navigate("/MainDashboard/technician")
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message)
            alert(error.response?.data?.message || "Error editing technician")
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
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Technician</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Technician Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Technician Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={technician.name}
                                    onChange={handleChange}
                                    required
                                    pattern="^[A-Za-z\s]{2,10}$"
                                    title="Name should contain only letters and spaces (2-10 characters)"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={technician.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={technician.phone}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{10}"
                                    title="Phone number must be 10 digits"
                                    placeholder="0123456789"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Specialty */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={technician.specialty}
                                    onChange={handleChange}
                                    required
                                    pattern="^[A-Za-z\s]{2,50}$"
                                    title="Specialty should contain only letters and spaces (2-50 characters)"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Availability</label>
                                <select
                                    name="availability"
                                    value={technician.availability}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option value="">-- Select Availability --</option>
                                    <option value="available">available</option>
                                    <option value="not-available">not available</option>
                                </select>
                            </div>

                            {/* Work */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Work</label>
                                 <select
                                    name="work"
                                    value={technician.work}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option value="">-- Select Work --</option>
                                    <option value="assigned">assigned</option>
                                    <option value="not-assigned">not assigned</option>
                                </select>
                                   
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                                Edit Technician
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditT