import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Navbar'
import Sidebar from '../SideBars'

function Edit() {
    const { id } = useParams()
    const [maintain, setMaintenance] = useState({
        machineName: '',
        priority: '',
        date: '',
        description: '',
        status: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setMaintenance(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        if (!id) {
            console.error("Invalid ID from URL:", id)
            alert("Invalid maintenance ID")
            return
        }

        const fetchMaintenance = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://localhost:3001/Maintenance/${id}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
                })
                if (response.status === 200) setMaintenance(response.data.maintenance)
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message)
                alert(error.response?.data?.message || "Error fetching maintenance")
            } finally {
                setLoading(false)
            }
        }
        fetchMaintenance()
    }, [id])

    if (loading) return <div>Loading ...</div>
    if (!maintain) return <div>Maintenance not found</div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3001/Maintenance/${id}`, maintain, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) navigate("/MainDashboard/maintenance")
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message)
            alert(error.response?.data?.message || "Error editing maintenance")
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
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Maintenance</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Machine Name (read-only) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Machine Name</label>
                                <input
                                    type="text"
                                    name="machineName"
                                    value={maintain.machineName}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={maintain.priority}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option value="">-- Select Priority --</option>
                                    <option value="low">low</option>
                                    <option value="medium">medium</option>
                                    <option value="high">high</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={maintain.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={maintain.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Maintenance Status</label>
                                <select
                                    name="status"
                                    value={maintain.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option value="pending">pending</option>
                                    <option value="under-maintenance">under maintenance</option>
                                    <option value="completed">completed</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                                Edit Maintenance
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit