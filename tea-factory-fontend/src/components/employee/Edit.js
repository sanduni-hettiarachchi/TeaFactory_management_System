import React, { useEffect, useState } from 'react'
import { fetchDepartment } from '../../utills/EmpHelper'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {

  const [employee, setEmployee] = useState({
    name: '',
    gender: '',
    martalStatus: '',
    designation: '',
    salary: 0,
    role: '',
    department: ''
  });
  const [departments, setDepartments] = useState(null)
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(() =>{
      const getDepartments = async () =>{
        const departments = await fetchDepartment()
        setDepartments(departments)
      };
      getDepartments();
  },[]);

  useEffect(() =>{
    const fetchEmployee = async () =>{
        try{
            const response = await axios.get(`http://localhost:3001/api/Emp/${id}`,{
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            }
            });
            if(response.data.success){
                const employee = response.data.employee;
                setEmployee((prev) => ({...prev, 
                    name: employee.userId.name, 
                    gender:employee.gender,
                    martalStatus: employee.martalStatus,
                    designation: employee.designation,
                    salary: employee.salary,
                    role: employee.role,
                    department: employee.department

                 }));
            }
        }catch(error){
            if(error.response && !error.response.data.success){
            alert(error.response.data.error)
            }
        }
        };

        fetchEmployee();
  },[id]);

  const handleChange = (e) =>{
    const{name, value} = e.target
      setEmployee((prevData) => ({...prevData, [name] : value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(`http://localhost:3001/api/Emp/${id}`, employee, {
          headers: {
             "Authorization" : `Bearer ${localStorage.getItem('token')}`
          }
      })
      if(response.data.success){
          navigate("/admin-dashboard/employees")
      }

      } catch (error) {
        if(error.response && !error.response.data.success){
          alert(error.response.data.error)
        }
      }
  }

  return (
    <>{departments && employee ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              placeholder='Insert Name'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Gender
            </label>
            <select name='gender' onChange={handleChange} value={employee.gender} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Marital Status
            </label>
            <select name='martalStatus' onChange={handleChange} value={employee.martalStatus} placeholder ="Marital Status" className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Designation
            </label>
            <input
              type='text'
              name='designation'
              onChange={handleChange}
              value={employee.designation}
              placeholder='Designation'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Salary
            </label>
            <input
              type='number'
              name='salary'
              onChange={handleChange}
              value={employee.salary}
              placeholder='Salary'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <select name='role' onChange={handleChange} value={employee.role} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Role</option>
              <option value="employee">HR Manager</option>
              <option value="InManager">Inventory Manager</option>
              <option value="MaManager">Maintenance Manager</option>
              <option value="DeManager">Delivery Manager</option>
              <option value="TeaPluck">Tea Plucker</option>
              <option value="EsraManger">Estate Manager</option>
              <option value="mandor">Mandor</option>
              <option value="transportW">Transport Worker</option>
              <option value="clarkl">Leaf Clerk</option>
              <option value="fdt">Factory Dispatch Team</option>
            </select>
          </div>
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Department
            </label>
            <select name='department' onChange={handleChange} value={employee.department} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Departmeent</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
            type='submit'
            className='w-full mt-6 bg-teal-600 hover:bg-teal-700 teaxt-white font-bold py-2 px-4 rounded'>
              Edit Employee
            </button>
      </form>
        
    </div>
    ) : <div>Loading....</div>}</>
 )
}

export default Edit