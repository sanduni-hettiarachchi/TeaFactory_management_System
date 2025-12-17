import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { columns, MachineButtons } from '../MachineHelper'
import axios from 'axios'
import SideBar from '../SideBars'
import Navbar from '../Navbar'

function MachinesList() {
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchStatus, setSearchStatus] = useState('')

  const onMachineDelete = useCallback((id) => {
    setMachine(prev => prev.filter(machine => machine._id !== id))
  }, [])

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:3001/Machine', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          let sno = 1
          const data = response.data.Machines.map((machine) => (
            {
              _id: machine._id,
              sno: sno++,
              name: machine.name,
              type: machine.type,
              location: machine.location,
              status: machine.status,
              action: (<MachineButtons id={machine._id} onMachineDelete={onMachineDelete} />)
            }
          ))
          setMachine(data)
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message)
        alert(error.response?.data?.message || "Error fetching machines")
      } finally {
        setLoading(false)
      }
    }
    fetchMachines()
  }, [onMachineDelete])

  const filteredMachines = machine?.filter(m =>
    m.status.toLowerCase().includes(searchStatus.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6 ml-64 mt-12 bg-transparent">
        Loading machines...
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-screen bg-[#b5fcca] overflow-y-auto">
      <Navbar />
      <SideBar />

      {/* Header */}
      <div className="text-center mt-4">
        <h3 className="text-2xl font-bold text-gray-800">Manage Machines</h3>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 px-6">
        <input
          type="text"
          placeholder="Search by Machine Status"
          className="py-2 px-4 border border-gray-300 rounded-md"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <Link
          to="/MainDashboard/add-machine"
          className="py-2 px-4 bg-teal-600 rounded-md text-white font-medium hover:bg-teal-700 transition-colors"
        >
          Add New Machine
        </Link>
      </div>

      {/* Table */}
      <div className="px-6">
        <table className="w-full border-collapse mt-6 bg-white/90 rounded-md overflow-hidden shadow-sm">
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
            {filteredMachines && filteredMachines.map((row, index) => (
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
  )
}

export default MachinesList