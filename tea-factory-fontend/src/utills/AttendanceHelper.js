import axios from 'axios';
import React from 'react'

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "70px",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "100px",
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        sortable: true,
        width: "100px",
    },
    {
        name: "Department",
        selector: (row) => row.department,
        width: "200px",
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true
    },
];

const AttendanceHelper = ({ status, employeeId, statusChange }) => {

    const markEmployee = async (status, employeeId) => {
        const response = await axios.put(
            `http://localhost:3001/api/attendance/update/${employeeId}`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        if (response.data.success) {
            statusChange()
        }
    }

    return (
        <div>
            {status == null ? (
                <div className='flex flex-wrap gap-3 justify-center'>
                    <button
                        className='px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow-sm transition'
                        onClick={() => markEmployee("present", employeeId)}
                    >
                        Present
                    </button>
                    <button
                        className='px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm transition'
                        onClick={() => markEmployee("absent", employeeId)}
                    >
                        Absent
                    </button>
                    <button
                        className='px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm transition'
                        onClick={() => markEmployee("sick", employeeId)}
                    >
                        Sick
                    </button>
                    <button
                        className='px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-sm transition'
                        onClick={() => markEmployee("leave", employeeId)}
                    >
                        Leave
                    </button>
                </div>
            ) : (
                <p className='bg-gray-100 text-gray-700 w-24 text-center py-2 rounded-md font-medium shadow-sm capitalize'>
                    {status}
                </p>
            )}
        </div>
    )
}

export default AttendanceHelper
