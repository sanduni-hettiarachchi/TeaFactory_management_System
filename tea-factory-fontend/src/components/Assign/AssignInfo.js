import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../SideBars';
import Navbar from '../Navbar';

function AssignInfo() {
  const { id } = useParams();
  const [assign, setAssign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchAssignById = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Assign/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 200) setAssign(response.data.assign);
      } catch (err) {
        setError("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignById();
  }, [id]);

  const handlePrint = () => {
  const printContents = printRef.current.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Assignment Info</title>');
  printWindow.document.write(
    `<style>
      body {
        margin: 40px;
        padding: 0;
        font-family: Arial, sans-serif;
        background: #fff;
      }
      h3 {
        text-align: center;
        color: green;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      td, th {
        border: 1px solid #444;
        padding: 6px 10px;
        vertical-align: top;
      }
      td.label {
        text-align: right;
        font-weight: 600;
        width: 40%;
        white-space: nowrap;
        background: #f2f2f2;
      }
      td.value {
        text-align: left;
        width: 60%;
      }
    </style>`
  );
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

  if (loading) return <div className="p-6 ml-64 mt-12">Loading...</div>;
  if (error) return <div className="p-6 ml-64 mt-12 text-red-600">{error}</div>;

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64 bg-[#b5fcca] min-h-screen">
        <Navbar />
        <div className="p-6 mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Inform The Technician
          </h2>

          <div ref={printRef} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center text-green-600">
              Assignment Details
            </h3>
            <table className="w-full mx-auto border-collapse">
              <tbody>
                <tr>
                  <td className="label w-2/5 py-1 px-2 whitespace-nowrap">Technician Name -</td>
                  <td className="value w-3/5 py-1 px-4">{assign.techname}</td>
                </tr>
                <tr>
                  <td className="label w-2/5 py-1 px-2 whitespace-nowrap">Machine Name -</td>
                  <td className="value w-3/5 py-1 px-4">{assign.machinename}</td>
                </tr>
                <tr>
                  <td className="label w-2/5 py-1 px-2 whitespace-nowrap">Assigned Date -</td>
                  <td className="value w-3/5 py-1 px-4">{new Date(assign.adate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="label w-2/5 py-1 px-2 whitespace-nowrap">Should Complete -</td>
                  <td className="value w-3/5 py-1 px-4">{new Date(assign.edate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="label w-2/5 py-1 px-2 whitespace-nowrap">Maintenance Issue -</td>
                  <td className="value w-3/5 py-1 px-4">{assign.issue}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignInfo;