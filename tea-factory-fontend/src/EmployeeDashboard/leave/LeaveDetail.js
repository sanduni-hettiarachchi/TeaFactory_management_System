import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const LeaveDetail = () => {
    const {id} = useParams()
    const [leave, setLeave] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLeave = async () => {
        try{
            const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
            const response = await axios.get(`${base}/api/leave/detail/${id}`,{
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            }
            });
            if(response.data.success){
                setLeave(response.data.leave)
            }
        }catch(error){
            if(error.response && !error.response.data.success){
            alert(error.response.data.error)
            }
        }
        };

        fetchLeave();
    }, [id]);

    const changeStatus = async (id,status) => {
        try{
            const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
            const response = await axios.put(`${base}/api/leave/${id}`, {status},{
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            }
            });
            if(response.data.success){
                navigate("/admin-dashboard/leaves")
            }
        }catch(error){
            if(error.response && !error.response.data.success){
            alert(error.response.data.error)
            }
        }
    }
  return (
    <>{leave ?(
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Leave Details
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
            {/* Image */}
            <div className="flex justify-center">
            {leave?.employeeId?.userId?.profileImage ? (
              <img 
                  src={`${(process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001')}/${leave.employeeId.userId.profileImage}`} 
                  alt='Employee'
                  className='w-72 h-72 rounded-full border object-cover' 
              />
            ) : (
              <div className='w-72 h-72 rounded-full border flex items-center justify-center text-gray-500'>
                No Image
              </div>
            )}
            </div>

            {/* Details */}
            <div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Name:</p>
                <p className='font-medium'>{leave?.employeeId?.userId?.name || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Employee ID:</p>
                <p className='font-medium'>{leave?.employeeId?.employeeId || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Leave Type</p>
                <p className='font-medium'>{leave?.leaveType}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Reason:</p>
                <p className='font-medium'>{leave?.reason || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Email:</p>
                <p className='font-medium'>{leave?.employeeId?.userId?.email || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Department:</p>
                <p className='font-medium'>{leave?.employeeId?.department?.dep_name || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Start Date:</p>
                <p className='font-medium'>{new Date(leave?.startDate).toLocaleDateString()}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>End Date:</p>
                <p className='font-medium'>{new Date(leave?.endDate).toLocaleDateString()}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>
                    {leave.staus === "Pending" ? "Action: " : "Status: "}
                </p>
                {leave.status === "Pending" ? (
                    <div className='flex space-x-3'>
                        <button className='px-2 py-0.5 bg-blue-500 hover:bg-blue-600' 
                        onClick={() => changeStatus(leave._id, "Approved")}>Approved</button>
                        <button className='px-2 py-0.5 bg-red-500 hover:bg-red-600'
                        onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>
                    </div>
                ) : <p className='font-medium'>{leave?.status}</p>
            }
            </div>
            </div>
        </div>
    </div>
    ): <div>Loading.....</div>}</>
  )
}

export default LeaveDetail