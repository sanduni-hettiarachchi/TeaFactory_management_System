import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinOurTeam = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    description: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => setPdfFile(e.target.files[0]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";

    if (!formData.contact) newErrors.contact = "Contact number is required.";
    else if (!/^0\d{9}$/.test(formData.contact)) {
      newErrors.contact = "Contact must start with 0 and be exactly 10 digits.";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!pdfFile) newErrors.pdf = "PDF file is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("pdf", pdfFile);

      const response = await axios.post(
        "http://localhost:3001/api/Member/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "✅ Ticket submitted successfully!" });
        setFormData({ name: "", email: "", contact: "", subject: "", description: "" });
        setPdfFile(null);
        setTimeout(() => navigate("/join"), 2000);
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Something went wrong. Please try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full px-6 py-4 flex items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex items-center space-x-2">
          <img src={assets} alt="Ranaya Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-bold text-white">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <a href="/join" className="hover:text-green-300 px-3 py-1 rounded-md bg-green-700">Join Us</a>
          </li>
          <li><a href="/home" className="hover:text-green-300">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300">News</a></li>
          <li><a href="/ContactUspage" className="hover:text-green-300">Contact Us</a></li>
        </ul>
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl"><FaBars /></button>
        </div>
      </nav>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-600">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl"><FaTimes /></button>
        </div>
        <ul className="flex flex-col space-y-4 mt-6 px-4 text-lg">
          <li><a href="/home" onClick={() => setSidebarOpen(false)}>Home</a></li>
          <li><a href="/ourStory" onClick={() => setSidebarOpen(false)}>Our Story</a></li>
          <li><a href="/ourOfferings" onClick={() => setSidebarOpen(false)}>Our Products</a></li>
          <li><a href="/NewsPage" onClick={() => setSidebarOpen(false)}>News</a></li>
          <li><a href="/ContactUspage" onClick={() => setSidebarOpen(false)}>Contact Us</a></li>
        </ul>
      </div>

      {/* Form Section */}
      <main className="min-h-screen bg-gradient-to-b from-green-700 to-gray-100 flex items-center justify-center py-10 px-4">
        <div className="max-w-3xl mx-auto mt-8 mb-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Submit a Ticket - HR Department</h2>

          {message.text && (
            <div className={`mb-4 p-4 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-semibold text-gray-700">Your Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-gray-700">Your Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block font-semibold text-gray-700">Contact Number *</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block font-semibold text-gray-700">Subject *</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block font-semibold text-gray-700">Upload Your CV File *</label>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full mt-1" />
              {pdfFile && <p className="text-green-700 text-sm mt-1">Selected file: {pdfFile.name}</p>}
              {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center md:text-left">
          <div>
            <h4 className="text-lg font-semibold mb-2">Ranaya Tea Factory</h4>
            <p>Export Processing Center, 24 Parakrama Road, Mathumagala, Ragama, Sri Lanka.</p>
            <p className="mt-2">Phone: +94 114 789 999</p>
            <p>Email: inquiry@ranaya.com</p>
            <p>Email: sales.ceylon@ranaya.com</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src={assets} alt="Factory Logo" className="w-12 h-12 mb-2" />
            <h4 className="text-xl font-bold">RANAYA</h4>
            <p className="text-sm tracking-widest">CLIMATE POSITIVE AND BEYOND</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Head Office</h4>
            <p>153 Nawala Road, Narahenpita, Colombo 05, Sri Lanka.</p>
            <p className="mt-2">Phone: +94 11 2510000</p>
          </div>
        </div>
        <div className="text-center mt-8 text-sm border-t border-white/30 pt-4">
          © {new Date().getFullYear()} Ranaya Tea. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default JoinOurTeam;
