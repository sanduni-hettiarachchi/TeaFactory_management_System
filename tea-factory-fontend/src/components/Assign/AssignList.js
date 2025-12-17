import React, {useCallback, useEffect, useState } from 'react'
import { columns, AssignButtons } from './AssignHelp'
import axios from 'axios'
import SideBar from '../SideBars'
import Navbar from '../Navbar'

function AssignList() {
  const [assign, setAssign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const onAssignDelete = useCallback((id) => {
      setAssign(prev => prev.filter(assign => assign._id !== id))
    }, [])

  useEffect(() => {
    const fetchAssign = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('http://localhost:3001/Assign', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          let sno = 1
          const data = response.data.assigns.map((assign) => (
            {
              _id: assign._id,
              sno: sno++,
              techname: assign.techname,
              machinename: assign.machinename,
              adate: assign.adate,
              issue: assign.issue,
              edate: assign.edate,
              action: (<AssignButtons id={assign._id} onAssignDelete={onAssignDelete} />)
            }
          ))
          setAssign(data)
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message)
        if (error.code === 'ECONNREFUSED') {
          setError("Cannot connect to server. Make sure the backend is running on port 5000.")
        } else {
          setError(error.response?.data?.message || "Error fetching assign")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAssign()
  }, [onAssignDelete])

  if (loading) {
    return <div className="p-6 ml-64 mt-12">Loading assigns...</div>
  }

  if (error) {
    return (
      <div className="p-6 ml-64 mt-12">
        <div className="text-red-600 font-medium">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        <Navbar />

        <div className="p-6 mt-12">
          {/* Header */}
          <div className="text-center mt-4">
            <h3 className="text-2xl font-bold text-gray-800">Manage Assigned Technicians</h3>
          </div>

          

          {/* Table */}
          <div className="mt-6 bg-white/90 rounded-md shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-gray-200 p-3 text-lg bg-green-500 font-semibold text-white"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assign && assign.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-200 p-3 text-center text-lg"
                      >
                        {column.selector(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignList