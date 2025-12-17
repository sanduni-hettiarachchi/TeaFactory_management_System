import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../SideBars';
import Navbar from '../Navbar';

function Techpdf() {
  const { id } = useParams();
  const [technician, setTechnician] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/Technician/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        setTechnician(res.data.technician);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, [id]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSend = async () => {
    if (!file) return alert('Please select a PDF file first!');
    setSending(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`http://localhost:3001/Technician/send-pdf/${id}`, formData);
      setMessage(res.data.message);

        //////// ✅ Update work status to "Assigned" in UI after successful send
      setTechnician((prev) => ({ ...prev, work: "Assigned" }));


    } catch (err) {
      console.error(err);
      setMessage('Failed to send PDF.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64 flex flex-col bg-[#b5fcca] min-h-screen">
        <Navbar />
        <div className="p-6 mt-12 flex justify-center">
          {loading && <p>Loading technician details...</p>}

          {technician && (
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                Send PDF to Technician
              </h2>

              <div className="space-y-4">
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-gray-800"><strong>Name:</strong> {technician.name}</p>
                  <p className="text-gray-800"><strong>Email:</strong> {technician.email}</p>
                </div>

                <div className="mt-4">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Choose PDF File
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-gray-800 border border-gray-300 rounded-md cursor-pointer focus:ring focus:ring-green-300 focus:outline-none p-2 bg-gray-50"
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                  >
                    {sending ? 'Sending...' : 'Send PDF'}
                  </button>
                </div>

                {message && (
                  <p className={`mt-4 text-center font-semibold ${message.includes('Failed') ? 'text-red-600' : 'text-green-700'}`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Techpdf;