import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexs/AuthContext'

const SalaryView = () => {
  const [salaries, setSalaries] = useState(null)
  const [filteredSalaries, setFilteredSalaries] = useState([])
  const { id } = useParams()
  let sno = 1
  const { admin } = useAuth()

  const fetchSalaries = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/Emp/salary/${id}/${admin.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.data.success) {
        setSalaries(response.data.salary)
        setFilteredSalaries(response.data.salary)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message)
      }
    }
  }, [id, admin.role])

  useEffect(() => {
    fetchSalaries()
  }, [fetchSalaries])

  const filterSalaries = (q) => {
    if (!salaries) return
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.employeeId
        .toLowerCase()
        .includes(q.toLowerCase())
    )
    setFilteredSalaries(filteredRecords)
  }

  return (
    <>
      {salaries === null ? (
        <div className="text-center mt-10 text-gray-600 font-medium">
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Salary History
            </h2>
          </div>

          {/* Search */}
          <div className="flex justify-end mt-4">
            <input
              type="text"
              placeholder="Search by Emp ID"
              className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              onChange={(e) => filterSalaries(e.target.value)}
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-600 mt-6 border border-gray-200 rounded-md shadow-md">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3">SNO</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{sno++}</td>
                    <td className="px-6 py-3">
                      {salary.employeeId.employeeId}
                    </td>
                    <td className="px-6 py-3">{salary.basicSalary}</td>
                    <td className="px-6 py-3">{salary.allowances}</td>
                    <td className="px-6 py-3">{salary.deductions}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">
                      {salary.netSalary}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mt-6 text-center text-gray-500">
              No Records Found
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SalaryView
