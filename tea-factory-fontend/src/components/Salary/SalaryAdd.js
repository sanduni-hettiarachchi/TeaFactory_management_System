import React, { useEffect, useState } from 'react'
import { fetchDepartment, getEmployees } from '../../utills/EmpHelper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SalaryAdd = () => {
  const [employee, setEmployee] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  })
  const [departments, setDepartments] = useState(null)
  const [employees, setEmployees] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartment()
      setDepartments(departments)
    }
    getDepartments()
  }, [])

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value)
    setEmployees(emps)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmployee((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `http://localhost:3001/api/Emp/addSalary`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.data.success) {
        navigate('/admin-dashboard/employees')
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    }
  }

  return (
    <>
      {departments && employees ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Add Salary
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  value={employee.department}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  name="employeeId"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  onChange={handleChange}
                  placeholder="Insert Salary"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Allowances */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  onChange={handleChange}
                  placeholder="Monthly Allowances"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  onChange={handleChange}
                  placeholder="Monthly Deductions"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition"
            >
              Add Salary
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-600 font-medium">
          Loading...
        </div>
      )}
    </>
  )
}

export default SalaryAdd
