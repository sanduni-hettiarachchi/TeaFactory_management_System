import { useNavigate } from "react-router-dom"
import axios from 'axios'

export const columns = [
  { name: "S No", selector: (row) => row.sno },
  { name: "Technician Name", selector: (row) => row.name },
  { name: "E-mail", selector: (row) => row.email },
  { name: "Phone No", selector: (row) => row.phone },
  { name: "Specialty", selector: (row) => row.specialty },
  { name: "Availability", selector: (row) => row.availability },
  { name: "Work", selector: (row) => row.work },
  { name: "Action", selector: (row) => row.action }
]

export const TechnicianButtons = ({ id, onTechnicianDelete }) => {
  const navigate = useNavigate()

  const handleDelete = async () => {
    const confirm = window.confirm("Do you want to delete?")
    if (confirm) {
      try {
        const response = await axios.delete(`http://localhost:3001/Technician/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          onTechnicianDelete(id)
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || "Error deleting technician")
      }
    }
  }

  const handleAssign = () => {
    // ✅ Navigate to Techpdf.js page with technician ID
    navigate(`/MainDashboard/technician/assign/${id}`);
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      <button
        onClick={() => navigate(`/MainDashboard/technician/${id}`)}
        className="px-3 py-1 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
      >
        Delete
      </button>
      <button  onClick={handleAssign} className="px-3 py-1 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition">Assign</button>
    </div>
  )
}