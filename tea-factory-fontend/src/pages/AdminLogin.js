import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../output.css';
import axios from 'axios';
import { useAuth } from '../contexs/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import assets from "../assets/RANAYA Logo.png"


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Navbar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If user enters a role as the password, navigate directly without hitting the API
      const pwLower = String(password || '').trim().toLowerCase();
      const roleRoutes = {
        demanager: '/Delidashboard',
        maimanager: '/MainDashboard',
        salmanager: '/admin/orders',
        inmanager: '/dashboard',
      };

      if (pwLower && roleRoutes[pwLower]) {
        // Create a minimal session to avoid auth-guard issues on dashboards
        login({ role: pwLower, email, name: 'Bypass User' });
        localStorage.setItem('token', 'DEV_BYPASS');
        navigate(roleRoutes[pwLower]);
        return;
      }

      // Otherwise, proceed with normal login flow
      const response = await axios.post('http://localhost:3001/api/adlogin', { email, password });
      if(response.data.success){
        const { admin, token } = response.data;
        login(admin);
        localStorage.setItem("token", token);
        const role = String(admin?.role || '').toLowerCase();
        if(role === 'admin') {
          navigate('/admin-dashboard');
        }else if(role === 'demanager'){
          navigate('/Delidashboard')
        }else if(role === 'maimanager'){
          navigate('/MainDashboard');
        }else if(role === 'salmanager'){
          navigate('/admin/orders')
        }else if(role === 'inmanager'){
          navigate('/dashboard')
        }else{
          navigate('/emp-dashboard')
        }
      }
    } catch (error) {
      if(error.response && !error.response.data.success){
        setError(error.response.data.error);
      } else {
        setError("server error");
      }
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 w-full px-6 bg-black/80 py-4 flex flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex flex-col items-center ms-5">
          <img src={assets} alt="Ranaya Logo" className="w-8 h-8 object-contain mb-2" />
          <span className="text-2xl font-bold text-white">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><Link to="/home" className="hover:text-green-300 ">Home</Link></li>
          <li><Link to="/ourStory" className="hover:text-green-300">Our Story</Link></li>
          <li><Link to="/ourOfferings" className="hover:text-green-300">Our Products</Link></li>
          <li><Link to="/NewsPage" className="hover:text-green-300">News</Link></li>
          <li><Link to="/ContactUspage" className="hover:text-green-300">Contact Us</Link></li>
        </ul>
        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <div className="border rounded-lg">
            <input type="text" placeholder="Search..." className="px-3 py-1 rounded-md text-green-500" />
          </div>
          <Link to="/join" className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300">Join Us</Link>
        </div>
        <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}><FaBars /></button>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-600">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl"><FaTimes /></button>
        </div>
        <ul className="flex flex-col space-y-4 mt-6 px-4 text-lg">
          <li><Link to="/home" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Home</Link></li>
          <li><Link to="/ourStory" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Story</Link></li>
          <li><Link to="/ourOfferings" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Products</Link></li>
          <li><Link to="/NewsPage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>News</Link></li>
          <li><Link to="/ContactUspage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
        </ul>
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-green-800 from-50% to-gray-100 to-50% space-y-6 pt-24">
        <h2 className="font-bold text-3xl text-white">Login to the Dashboard</h2>
        <div className="border shadow p-6 w-80 bg-white">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input type="email" className="w-full px-3 py-2 border" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input type="password" className="w-full px-3 py-2 border" placeholder="************" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-teal-600">Forgot password?</Link>
            </div>
            <div className="mb-4">
              <button type="submit" className="w-full bg-green-700 text-white py-2">Login</button>
            </div>
          </form>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center md:text-left">
          {/* LEFT SIDE */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Ranaya Tea Factory</h4>
            <p>Export Processing Center,</p>
            <p>24 Parakrama Road, Mathumagala,</p>
            <p>Ragama, Sri Lanka.</p>
            <p className="mt-2">Phone: +94 114 789 999</p>
            <p>Email: inquiry@ranaya.com</p>
            <p>Email: sales.ceylon@ranaya.com</p>
          </div>
          {/* MIDDLE */}
          <div className="flex flex-col items-center justify-center">
            <img 
              src={assets}
              alt="Factory Logo"
              className="w-12 h-12 mb-2"
            />
            <h4 className="text-xl font-bold">RANAYA</h4>
            <p className="text-sm tracking-widest">CLIMATE POSITIVE AND BEYOND</p>
          </div>
          {/* RIGHT SIDE */}
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
};

export default AdminLogin;
