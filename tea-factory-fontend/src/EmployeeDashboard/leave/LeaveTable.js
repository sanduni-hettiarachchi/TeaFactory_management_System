import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LeaveButtons, { columns } from '../../utills/LeaveHelper'
import DataTable from 'react-data-table-component'

const LeaveTable = () => {
    const [leaves, setLeaves] = useState(null)
    const [filteredLeaves, setFilteredLeaves] = useState(null)

    const fetchLeaves = async () => {
        try {
            const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
            const response = await axios.get(`${base}/api/leave`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                let sno = 1;
                const data = await response.data.leaves.map((leave) => ({
                    _id: leave._id,
                    sno: sno++,
                    employeeId: leave.employeeId.employeeId,
                    name: leave.employeeId.userId.name,
                    leaveType: leave.leaveType,
                    department: leave.employeeId.department.dep_name,
                    days: new Date(leave.endDate).getDate() - new Date(leave.startDate).getDate(),
                    status: leave.status,
                    action: <LeaveButtons Id={leave._id} />,
                }));
                setLeaves(data)
                setFilteredLeaves(data)
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    const filterByInput = (e) => {
        const data = leaves.filter(leave =>
            leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
        )
        setFilteredLeaves(data)
    }

    const filterByButton = (status) => {
        const data = leaves.filter((leave) =>
            leave.status.toLowerCase().includes(status.toLowerCase())
        )
        setFilteredLeaves(data)
    }

    return (
        <>
            {filteredLeaves ? (
                <div className='p-6 bg-gray-50 min-h-screen'>
                    <div className='text-center mb-6'>
                        <h3 className='text-3xl font-extrabold text-gray-800'>Manage Leaves</h3>
                    </div>

                    <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-md p-4 rounded-lg'>
                        <input
                            type='text'
                            placeholder='Search By Employee ID'
                            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none w-full md:w-1/3'
                            onChange={filterByInput}
                        />
                        <div className='flex flex-wrap gap-3'>
                            <button
                                className='px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-sm transition'
                                onClick={() => filterByButton("Pending")}
                            >
                                Pending
                            </button>
                            <button
                                className='px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow-sm transition'
                                onClick={() => filterByButton("Approved")}
                            >
                                Approved
                            </button>
                            <button
                                className='px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm transition'
                                onClick={() => filterByButton("Rejected")}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

                    <div className='mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-200'>
                        <DataTable columns={columns} data={filteredLeaves} pagination highlightOnHover striped />
                    </div>
                </div>
            ) : (
                <div className='text-center text-lg text-gray-600 font-medium'>Loading...</div>
            )}
        </>
    )
}

export default LeaveTable
