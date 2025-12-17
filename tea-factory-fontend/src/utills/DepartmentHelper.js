import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "80px",
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
    width: "250px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate()

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this department?")

    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.data.success) {
          onDepartmentDelete(id)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    }
  }

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md shadow-sm transition"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md shadow-sm transition"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button>
    </div>
  )
}
