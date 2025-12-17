import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "120px",
    cell: (row) => (
      <span className="font-medium text-gray-800">{row.name}</span>
    ),
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "200px",
    cell: (row) => (
      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm font-medium">
        {row.dep_name}
      </span>
    ),
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
    cell: (row) => (
      <span className="text-gray-600 text-sm">{row.dob}</span>
    ),
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const fetchDepartment = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:3001/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }

  return departments;
};

// employee salary department
export const getEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(
      `http://localhost:3001/api/Emp/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }

  return employees;
};

export const EmployeeButtons = ({ _id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
      >
        View
      </button>

      <button
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}
      >
        Edit
      </button>

      <button
        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${_id}`)}
      >
        Salary
      </button>

      <button
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${_id}`)}
      >
        Leave
      </button>
    </div>
  );
};
