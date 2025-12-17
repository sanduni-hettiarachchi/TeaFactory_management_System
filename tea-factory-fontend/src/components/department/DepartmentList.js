import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utills/DepartmentHelper'
import axios from 'axios'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [depLoading, setDepLoarding] = useState(false)
  const [filteredDepartments, setFilterDepartments] = useState([])

  const onDepartmentDelete = useCallback((id) => {
    setDepartments((prev) => prev.filter((dep) => dep._id !== id))
  }, [])

  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoarding(true)
      try {
        const response = await axios.get('http://localhost:3001/api/department', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.data.success) {
          let sno = 1
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentButtons
                _id={dep._id}
                onDepartmentDelete={onDepartmentDelete}
              />
            ),
          }))
          setDepartments(data)
          setFilterDepartments(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setDepLoarding(false)
      }
    }

    fetchDepartment()
  }, [onDepartmentDelete])

  const filterDepartments = (e) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilterDepartments(records)
  }

  return (
    <>
      {depLoading ? (
        <div className="text-center text-lg font-semibold text-gray-600 py-10">
          Loading...
        </div>
      ) : (
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800">
              Manage Departments
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search By Department Name"
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-auto"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium shadow transition"
            >
              Add New Department
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              highlightOnHover
              striped
              dense
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DepartmentList
