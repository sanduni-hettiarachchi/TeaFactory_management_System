import React, { useEffect, useState } from "react";
import axios from "axios";
import assets from "../assets/RANAYA Logo.png";
import {
  FaBars, 
  FaTimes,  
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaIndustry,
  FaLeaf,
  FaWeightHanging,
  FaStickyNote
} from "react-icons/fa";

const CustomerJoinForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    businessType: "",
    teaProducts: [],
    monthlyRequirement: "",
    additionalNotes: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
      const handleScroll = () => setNavScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        teaProducts: checked
          ? [...prev.teaProducts, value]
          : prev.teaProducts.filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone ||
        !formData.address || !formData.country || !formData.businessType || !formData.monthlyRequirement) {
      return "All required fields must be filled.";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Invalid email format.";
    }
    if (!/^(0\d{9}|\+\d{1,3}\d{6,14})$/.test(formData.phone)) {
      return "Phone must start with 0 (local) or include +country code.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/customer", formData);
      if (res.data.success) {
        setSuccess("Thank you for joining! Our team will contact you soon.");
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          country: "",
          businessType: "",
          teaProducts: [],
          monthlyRequirement: "",
          additionalNotes: ""
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
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
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 mt-10">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Join Ranaya Tea Factory as a Customer
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Company Name */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaBuilding className="text-green-600 mr-2" />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Contact Person */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaUser className="text-green-600 mr-2" />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person *"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaEnvelope className="text-green-600 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaPhone className="text-green-600 mr-2" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Address */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <input
              type="text"
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Country */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaGlobe className="text-green-600 mr-2" />
            <input
              type="text"
              name="country"
              placeholder="Country *"
              value={formData.country}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Business Type */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaIndustry className="text-green-600 mr-2" />
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            >
              <option value="">-- Select Business Type --</option>
              <option value="Foriegn Buyer">Foriegn Buyer</option>
              <option value="Export Partner">Export Partner</option>
              <option value="Local Buyer">Local Buyer</option>
              <option value="Retailer">Retailer</option>
              <option value="Hotel/Restaurant">Hotel/Restaurant</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Tea Products */}
          <div>
            <label className="block font-semibold mb-1 flex items-center">
              <FaLeaf className="text-green-600 mr-2" /> Preferred Tea Products
            </label>
            <div className="flex flex-wrap gap-3">
              {["Green Tea", "Black Tea", "Organic Tea", "Herbal Tea", "Bulk Orders"].map((product) => (
                <label key={product} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={product}
                    checked={formData.teaProducts.includes(product)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {product}
                </label>
              ))}
            </div>
          </div>

          {/* Monthly Requirement */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaWeightHanging className="text-green-600 mr-2" />
            <input
              type="number"
              name="monthlyRequirement"
              placeholder="Monthly Requirement (kg) *"
              value={formData.monthlyRequirement}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
              min="1"
            />
          </div>

          {/* Additional Notes */}
          <div className="flex items-start border rounded px-3 py-2">
            <FaStickyNote className="text-green-600 mr-2 mt-1" />
            <textarea
              name="additionalNotes"
              placeholder="Additional Notes..."
              rows="4"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full focus:outline-none"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
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

export default CustomerJoinForm;
