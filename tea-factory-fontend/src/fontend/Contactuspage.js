import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import assets from "../assets/RANAYA Logo.png";
import "../output.css";

// ✅ Hero images
const heroImages = [
  "https://us-east-1-shared-usea1-02.graphassets.com/A2lCPH6tTelhrsostvMQpz/auto_image/resize=fit:max,width:3840/quality=value:75/ZUMivtfRkCZgiJrnFuJN",
];

function ContactUs() {
  const [currentHero, setCurrentHero] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [responseMsg, setResponseMsg] = useState(null);

  // Auto slide hero background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Map configuration
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "10px",
  };

  const center = { lat: 7.0271, lng: 79.9229 };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email.";
    if (!/^0\d{9}$/.test(formData.phone))
      newErrors.phone = "Phone must start with 0 and be exactly 10 digits.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const res = await axios.post("http://localhost:3001/api/contact/add", formData);
      if (res.data.success) {
        setResponseMsg({ type: "success", text: "✅ Message sent successfully!" });
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      setResponseMsg({
        type: "error",
        text: error.response?.data?.error || "Something went wrong!",
      });
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full px-6 py-4 flex bg-black/80 flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex flex-col items-center ms-5">
          <img src={assets} alt="Ranaya Logo" className="w-8 h-8 object-contain mb-2" />
          <span className="text-2xl font-bold text-green">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><a href="/home" className="hover:text-green-300">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300">News</a></li>
          <li><a href="/ContactUspage" className="hover:text-green-300 underline underline-offset-4 decoration-green-500">Contact Us</a></li>
        </ul>
        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <div className="border rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded-md text-green-500"
            />
          </div>
          <a
            href="/join"
            className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300"
          >
            Join Us
          </a>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </button>
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative h-[100vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${heroImages[currentHero]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="max-w-2xl mx-auto text-lg">
            We would love to hear from you! Reach out to Ranaya Tea Factory with any inquiries, 
            feedback, or business opportunities.
          </p>
        </div>
      </section>

      {/* CONTACT FORM & DETAILS */}
      <section className="py-16 container mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-6">Send Us a Message</h2>

          {responseMsg && (
            <p
              className={`mb-4 text-center font-medium ${
                responseMsg.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {responseMsg.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-400"
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-400"
                placeholder="Your Email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block font-medium mb-2">Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-400"
                placeholder="0XXXXXXXXX"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label className="block font-medium mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 h-32 focus:ring-2 focus:ring-green-400"
                placeholder="Your Message"
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition w-full"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold text-green-700">Get in Touch</h2>
          <p>We are always happy to connect with tea lovers, partners, and communities.</p>
          <div>
            <p className="font-medium">Address:</p>
            <p>Ranaya Tea Factory, Golden Valley, Sri Lanka</p>
          </div>
          <div>
            <p className="font-medium">Phone:</p>
            <p>+94 71 234 5678</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>info@ranayatea.com</p>
          </div>
        </div>
      </section>

      {/* ✅ Google Map */}
      <section className="px-6 pb-12">
        <h3 className="text-2xl font-bold text-center mb-4">Find Us Here</h3>
        <LoadScript googleMapsApiKey="AIzaSyAkBKS1F5HQ2P1yCTrA51jtANiGUIpZps4">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </section>

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
}

export default ContactUs;
