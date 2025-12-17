import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png";
import axios from "axios";

export default function JoinUs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    lookingFor: "Something Else",
    name: "",
    phone: "",
    email: "",
    country: "",
    company: "",
    subject: "",
    question: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => /^0\d{9}$/.test(phone);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.phone || !formData.email || !formData.country || !formData.company || !formData.subject || !formData.question) {
      return setError("All fields are required.");
    }
    if (!validatePhone(formData.phone)) {
      return setError("Phone must start with 0 and be exactly 10 digits.");
    }
    if (!validateEmail(formData.email)) {
      return setError("Invalid email address.");
    }
    if (formData.question.length < 10) {
      return setError("Question must be at least 10 characters.");
    }

    try {
      const res = await axios.post("http://localhost:3001/api/inquiry/add", formData);
      if (res.data.success) {
        setSuccess("✅ Inquiry submitted successfully!");
        setFormData({
          lookingFor: "",
          name: "",
          phone: "",
          email: "",
          country: "",
          company: "",
          subject: "",
          question: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full px-6 bg-black/80 py-4 flex flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${navScrolled ? "bg-black text-white" : "bg-transparent text-white"}`}
      >
        <div className="flex flex-col items-center ms-5">
          <img src={assets} alt="Ranaya Logo" className="w-8 h-8 object-contain mb-2" />
          <span className="text-2xl font-bold text-white">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><a href="/join" className="hover:text-green-300 bg-green-700 px-4 py-2 rounded-lg">Join Us</a></li>
          <li><a href="/home" className="hover:text-green-300">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300">News</a></li>
          <li><a href="/ContactUspage" className="hover:text-green-300">Contact Us</a></li>
        </ul>
        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <div className="border rounded-lg">
            <input type="text" placeholder="Search..." className="px-3 py-1 rounded-md text-green-500" />
          </div>
          <a href="/login" className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300">Sign In</a>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </button>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-600">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl"><FaTimes /></button>
        </div>
        <ul className="flex flex-col space-y-4 mt-6 px-4 text-lg">
          <li><a href="/home" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Home</a></li>
          <li><a href="/ourStory" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>News</a></li>
          <li><a href="/ContactUspage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Contact Us</a></li>
        </ul>
      </div>

      {/* Hero Section */}
      <section className="bg-green-900 text-center py-16">
        <div className='mt-12'>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Looking forward to hearing from you...</h1>
          <p className="text-lg text-yellow-300 mt-4">The following channels are dedicated to help you get in touch with the right team.</p>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-12 px-6 bg-green-900 flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="flex flex-col gap-4">
          <button className="bg-white text-green-800 px-6 py-3 rounded-full shadow hover:bg-gray-100">Explore Our Offerings</button>
          <a href='/customerDetails' className="bg-white text-green-800 px-6 py-3 rounded-full shadow hover:bg-gray-100">Join as customer</a>
        </div>
        <img src="https://evergreengroup.lk/factories//images/home-slider/image0.jpg" alt="Tea workers" className="rounded-xl shadow-lg w-full md:w-[600px] object-cover" />
        <div className="flex flex-col gap-4">
          <a href='/suplier' className="bg-white text-green-800 px-6 py-3 rounded-full shadow hover:bg-gray-100">Become a Supplier</a>
          <a href='/joinOurTeam' className="bg-white text-green-800 px-6 py-3 rounded-full shadow hover:bg-gray-100">Join Our Team</a>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 px-6 bg-gray-50 flex-1">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">For Inquiries On Our Offerings</h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          {/* Radio Options */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Looking for?</label>
            <div className="flex flex-col md:flex-row gap-4">
              {["Our Brands", "Collaboration Opportunities", "Certifications and Compliance", "Something Else"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lookingFor"
                    value={option}
                    checked={formData.lookingFor === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject *" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600" />
            <textarea name="question" value={formData.question} onChange={handleChange} placeholder="Question *" rows="4" className="border p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-600 col-span-1 md:col-span-2"></textarea>
            <button type="submit" className="col-span-1 md:col-span-2 bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition">Submit</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center md:text-left">
          <div>
            <h4 className="text-lg font-semibold mb-2">Ranaya Tea Factory</h4>
            <p>Export Processing Center,</p>
            <p>24 Parakrama Road, Mathumagala,</p>
            <p>Ragama, Sri Lanka.</p>
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
            <h4 className="text-lg font-semibold mb-2">Ranaya Tea Factory</h4>
            <p>Head Office,</p>
            <p>153 Nawala Road, Narahenpita,</p>
            <p>Colombo 05, Sri Lanka.</p>
            <p className="mt-2">Phone: +94 11 2510000</p>
          </div>
        </div>
        <div className="text-center mt-8 text-sm border-t border-white/30 pt-4">
          © {new Date().getFullYear()} Ranaya Tea. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
