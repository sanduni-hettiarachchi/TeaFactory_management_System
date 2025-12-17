import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utills/EmpHelper'
import DataTable from 'react-data-table-component'
import { FaPaperPlane } from "react-icons/fa";




const EmpList = () => {
  const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoarding] = useState(false)
  const [filterEmployee, setFilterEmployee] = useState([])

  // 🔹 Unregistered Employees
  const [unregistered, setUnregistered] = useState([])
  const [unregLoading, setUnregLoading] = useState(false)
  const [filterUnreg, setFilterUnreg] = useState([])

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
    pdfFile: null,
    generratedPdfUrl: null,
  });

  const handleEmailChange = (e) => {
    const { name, value, files } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";
      const formData = new FormData();
      formData.append("to", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("message", emailData.message);

      if (emailData.pdfFile) {
        formData.append("pdfFile", emailData.pdfFile);
      } else if (emailData.generatedPdfUrl) {
        formData.append("pdfUrl", emailData.generatedPdfUrl); // backend should handle if pdfUrl provided
      }

      await axios.post(`${base}/api/Member/send`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Email sent successfully!");
      setShowEmailModal(false);
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email");
    }
  };

  const generateEmployeesPdf = async () => {
    try {
      const base = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";
      const response = await axios.get(`${base}/api/Member/generate-pdf`);
      if (response.data.success) {
        setEmailData((prev) => ({
          ...prev,
          generatedPdfUrl: response.data.pdfUrl,
          pdfFile: null, // clear manual upload if exists
        }));
        alert("Employees report attached!");
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF");
    }
  };



  // ✅ Fetch Registered Employees
  useEffect(() => {
    const fetchEmployee = async () => {
      setEmpLoarding(true)
      try {
        const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
        const response = await axios.get(`${base}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => {
            const depName = emp?.department?.dep_name || '-'
            const userName = emp?.userId?.name || '-'
            const dob = emp?.dob ? new Date(emp.dob).toLocaleDateString() : '-'
            const imgSrc = emp?.userId?.profileImage ? `${base}/${emp.userId.profileImage}` : null

            return {
              _id: emp?._id,
              sno: sno++,
              dep_name: depName,
              name: userName,
              dob: dob,
              profileImage: imgSrc ? (
                <img
                  width={40}
                  height={40}
                  className='rounded-full ring-2 ring-gray-200 shadow-sm'
                  src={imgSrc}
                  alt='Employee'
                />
              ) : null,
              action: (<EmployeeButtons _id={emp?._id} />),
            }
          });
          setEmployees(data);
          setFilterEmployee(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setEmpLoarding(false)
      }
    };

    fetchEmployee();
  }, []);

  const deleteUnregistered = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unregistered employee?")) return;
    try {
      const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001';
      await axios.delete(`${base}/api/Member/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUnregistered(unregistered.filter(emp => emp._id !== id));
      setFilterUnreg(filterUnreg.filter(emp => emp._id !== id));
    } catch (err) {
      console.error("Error deleting unregistered employee:", err);
    }
  };

  // ✅ Fetch Unregistered Employees
  useEffect(() => {
    const fetchUnregistered = async () => {
      setUnregLoading(true)
      try {
        const base = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001'
        const response = await axios.get(`${base}/api/Member/unregistered`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          let sno = 1
          const data = response.data.members.map((m) => ({
            _id: m._id,
            sno: sno++,
            name: m.name,
            email: m.email,
            contact: m.contact,
            subject: m.subject,
            description: m.description,
            pdf: (
              <a
                href={`${base}/${m.pdfUrl.replace(/^public[\\/]/, "").replace(/\\/g, "/")}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View CV
              </a>
            ),
            createdAt: new Date(m.createdAt).toLocaleDateString(),
          }))
          setUnregistered(data)
          setFilterUnreg(data)
        }
      } catch (err) {
        console.error("Error fetching unregistered employees:", err)
      } finally {
        setUnregLoading(false)
      }
    }

    fetchUnregistered()
  }, [])

  const handleFilter = (e) => {
    const record = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilterEmployee(record)
  }

  const handleFilterUnreg = (e) => {
    const record = unregistered.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilterUnreg(record)
  }

  return (
    <>
      {/* 🔹 Registered Employees */}
      {empLoading ? (
        <div className="text-center py-6 text-gray-600">Loading...</div>
      ) : (
        <div className='p-6 bg-white rounded-lg shadow-md mb-10'>
          <div className='text-center mb-6'>
            <h3 className='text-2xl font-bold text-gray-800'>Registered Employees</h3>
          </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search By Emp Name"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none w-full md:w-1/3"
            onChange={handleFilter}
          />
          <div className="flex gap-3">
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 bg-green-600 hover:bg-green-600 text-white rounded-md font-medium shadow transition"
            >
              Add New Employee
            </Link>
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 
                        text-white rounded-md font-medium shadow transition"
            >
              <FaPaperPlane className="text-white text-lg" />
              Send Email
            </button>
          </div>
        </div>
          <div>
            {filterEmployee && filterEmployee.length > 0 ? (
              <DataTable
                columns={columns}
                data={filterEmployee}
                pagination
              />
            ) : (
              <div className='text-center text-gray-500 py-6 italic'>
                No employees to display.
              </div>
            )}
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="fixed inset-0 bg-green-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Send Email to Employee</h3>
            <form onSubmit={sendEmail} className="space-y-4">
              {/* Employee Dropdown */}
              <select
                name="to"
                value={emailData.to}
                onChange={handleEmailChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.email || (emp.name + "@gmail.com")}>
                    {emp.name}
                  </option>
                ))}
              </select>

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={emailData.subject}
                onChange={handleEmailChange}
                className="w-full border px-3 py-2 rounded"
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Message"
                value={emailData.message}
                onChange={handleEmailChange}
                className="w-full border px-3 py-2 rounded"
                rows="4"
              />


              {/* OR Generate Employees Report */}
              <button
                type="button"
                onClick={generateEmployeesPdf}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Attach Employees Report
              </button>

              {emailData.generatedPdfUrl && (
                <p className="text-sm text-green-600 mt-2">
                  ✔ Employees report attached: {emailData.generatedPdfUrl}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 🔹 Unregistered Employees */}
      {unregLoading ? (
        <div className="text-center py-6 text-gray-600">Loading Unregistered...</div>
      ) : (
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <div className='text-center mb-6'>
            <h3 className='text-2xl font-bold text-gray-800'>Unregistered Employees</h3>
          </div>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <input
              type="text"
              placeholder='Search By Name'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none w-full md:w-1/3'
              onChange={handleFilterUnreg}
            />
          </div>
          <div>
            {filterUnreg && filterUnreg.length > 0 ? (
              <DataTable
                columns={[
                  { name: "SNo", selector: row => row.sno, sortable: true, width: "70px" },
                  { name: "Name", selector: row => row.name, sortable: true, width: "120px" },
                  { name: "Email", selector: row => row.email, width: "200px" },
                  { name: "Contact", selector: row => row.contact, width: "150px" },
                  { name: "Subject", selector: row => row.subject, width: "200px" },
                  { name: "Description", selector: row => row.description, width: "400px" },
                  { name: "CV", selector: row => row.pdf, width: "90px" },
                  { name: "Applied Date", selector: row => row.createdAt, width: "150px" },
                  {
                    name: "Action",
                    cell: row => (
                      <button
                        onClick={() => deleteUnregistered(row._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    ),
                    width: "120px"
                  }
                ]}
                data={filterUnreg}
                pagination
              />
            ) : (
              <div className='text-center text-gray-500 py-6 italic'>
                No unregistered employees found.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default EmpList
