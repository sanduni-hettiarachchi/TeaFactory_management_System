import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AttendenceReport = () => {

  const [report, setReport] = useState({})
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [dateFilter, setDateFilter] = useState()
  const [loading, setLoarding] = useState(false)

  const fetchReport = async () => {
    try {
      setLoarding(true)
      const query = new URLSearchParams({ limit, skip })
      if (dateFilter) {
        query.append("date", dateFilter)
      }

      const response = await axios.get(`http://localhost:3001/api/attendance/report?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        if (skip === 0) {
          setReport(response.data.groupData)
        } else {
          setReport((prevData) => ({ ...prevData, ...response.data.groupData }))
        }
      }
      setLoarding(false)
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    fetchReport()
  }, [skip, dateFilter])

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  }

  return (
    <div className='min-h-screen p-8 bg-gray-50'>
      <h2 className='text-center text-3xl font-extrabold text-gray-800 mb-8'>Attendance Report</h2>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-2'>Filter By Date</h2>
        <input
          type='date'
          className='border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none'
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSkip(0)
          }}
        />
      </div>

      {loading ? (
        <div className='text-center text-lg text-gray-600 font-medium'>Loading...</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div className='mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200' key={date}>
            <h2 className='text-xl font-bold text-green-600 mb-4'>{date}</h2>
            <div className='overflow-x-auto'>
              <table className='w-full border border-gray-200 text-left text-sm'>
                <thead className='bg-green-800 text-white'>
                  <tr>
                    <th className='px-4 py-2'>S No</th>
                    <th className='px-4 py-2'>Employee ID</th>
                    <th className='px-4 py-2'>Name</th>
                    <th className='px-4 py-2'>Department</th>
                    <th className='px-4 py-2'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {record.map((data, i) => (
                    <tr key={data.employeeId} className='odd:bg-white even:bg-gray-50 hover:bg-green-50 transition'>
                      <td className='px-4 py-2 border-t'>{i + 1}</td>
                      <td className='px-4 py-2 border-t'>{data.employeeId}</td>
                      <td className='px-4 py-2 border-t'>{data.employeeName}</td>
                      <td className='px-4 py-2 border-t'>{data.departmentName}</td>
                      <td className={`px-4 py-2 border-t font-semibold ${data.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                        {data.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <div className='flex justify-center mt-8'>
        <button
          className='px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition'
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </div>
    </div>
  )
}

export default AttendenceReport
