import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const View = () => {
    const {id} = useParams()
    const [employee, setEmployee] = useState(null)

    useEffect(() => {
        const fetchEmployee = async () => {
        try{
            const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
            const response = await axios.get(`${base}/api/Emp/${id}`,{
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            }
            });
            if(response.data.success){
                setEmployee(response.data.employee)
            }
        }catch(error){
            if(error.response && !error.response.data.success){
            alert(error.response.data.error)
            }
        }
        };

        fetchEmployee();
    }, [id]);
  return (
    <>{employee ?(
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Employee Details
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
            {/* Image */}
            <div className="flex justify-center">
            {employee?.userId?.profileImage ? (
              <img 
                  src={`${(process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001')}/${employee.userId.profileImage}`} 
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
                <p className='font-medium'>{employee?.userId?.name || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Employee ID:</p>
                <p className='font-medium'>{employee?.employeeId || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Date Of Birth:</p>
                <p className='font-medium'>{employee?.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Gender:</p>
                <p className='font-medium'>{employee?.gender || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Email:</p>
                <p className='font-medium'>{employee?.userId?.email || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Department:</p>
                <p className='font-medium'>{employee?.department?.dep_name || '-'}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold'>Marital Status:</p>
                <p className='font-medium'>{employee?.martalStatus || '-'}</p>
            </div>
            </div>
        </div>
    </div>
    ): <div>Loading.....</div>}</>
  )
}

export default View