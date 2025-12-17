import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from '../Navbar'
import Sidebar from '../SideBars'

function Add() {
    const [maintain, setMaintenance] = useState({
        machineName: '',
        priority: '',
        date: '',
        description: '',
        status: 'Pending'   // always default Pending
    })

    const [machines, setMachines] = useState([]); // store machine list
    const navigate = useNavigate()

    // Fetch machines on mount
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get('http://localhost:3001/Machine', {
                    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.status === 200) setMachines(response.data.Machines);
            } catch (error) {
                console.error("Error fetching machines:", error);
                alert(error.response?.data?.message || "Error fetching machines");
            }
        };
        fetchMachines();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaintenance({ ...maintain, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3001/Maintenance', maintain, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) navigate("/MainDashboard/maintenance")
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "Error adding maintenance");
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
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Maintenance</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Machine Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Machine Name</label>
                                <select
                                    name="machineName"
                                    value={maintain.machineName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    <option value="">-- Select Machine --</option>
                                    {machines.map((machine) => (
                                        <option key={machine._id} value={machine.name}>{machine.name}</option>
                                    ))}
                                </select>
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
                                    pattern="^[A-Za-z\s]{2,50}$"
                                    title="Description should contain only letters and spaces (2-50 characters)"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Status</label>
                                <input
                                    type="text"
                                    name="status"
                                    value={maintain.status}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                                Add Maintenance
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Add