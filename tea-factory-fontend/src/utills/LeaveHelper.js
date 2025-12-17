import React from 'react'
import { useNavigate } from 'react-router-dom'

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "70px",
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        width: "120px",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        width: "120px",
    },
    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "140px",
    },
    {
        name: "Department",
        selector: (row) => row.department,
        width: "170px",
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width: "80px",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        width: "120px",
        cell: (row) => {
            let badgeClasses = "px-2 py-1 rounded text-sm font-medium ";

            switch (row.status?.toLowerCase()) {
            case "approved":
                badgeClasses += "bg-green-100 text-green-700";
                break;
            case "pending":
                badgeClasses += "bg-yellow-100 text-yellow-700";
                break;
            case "rejected":
                badgeClasses += "bg-red-100 text-red-700";
                break;
            default:
                badgeClasses += "bg-gray-100 text-gray-600";
            } return <span className={badgeClasses}>{row.status}</span>;}
            

    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true
    },
]

const LeaveButtons = ({ Id }) => {
    const navigate = useNavigate()

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`)
    }

    return (
        <button
            className='px-4 py-2 rounded-md bg-green-700 hover:bg-green-500 text-white font-semibold shadow-sm transition'
            onClick={() => handleView(Id)}
        >
            View
        </button>
    )
}

export default LeaveButtons
