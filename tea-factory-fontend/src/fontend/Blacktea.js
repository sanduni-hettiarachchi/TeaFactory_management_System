import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png";

const PremiumBlackTea = () => {
  // IMAGE SLIDER IMAGES
  const images = [
    {
      url: "https://www.heavenlytealeaves.com/cdn/shop/files/Organic_Black_Lavender_Loose_Leaf_Black_Tea_1.jpg?v=1730846352&width=1445",
    },
    {
      url: "https://ceylonblacktea.com/images/top7-tea.jpg",
    },
    {
      url: "https://cdn.shopify.com/s/files/1/0258/5555/files/tearolling-blog.jpg?v=1679089129",
    },
  ];

  const image = [
    {
      url: "https://cdn.thewirecutter.com/wp-content/media/2023/09/tea-2048px-3052.jpg?auto=webp&quality=60&width=570",
    },
    {
      url: "https://inspirefoodcompany.com/cdn/shop/files/blackteapart12048.jpg?v=1744287113",
    },
    {
      url: "https://cdn.cybassets.com/s/files/24770/ckeditor/pictures/content_7e93046e-8196-47e8-a511-297be2897280.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans text-white-800">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full px-6 py-4 flex bg-black/80 flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex flex-col items-center ms-5">
          <img
            src={assets}
            alt="Ranaya Logo"
            className="w-8 h-8 object-contain mb-2"
          />
          <span className="text-2xl font-bold text-green">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <a href="/home" className="hover:text-green-300">
              Home
            </a>
          </li>
          <li>
            <a href="/ourStory" className="hover:text-green-300">
              Our Story
            </a>
          </li>
          <li>
            <a href="/ourOfferings" className="hover:text-green-300">
              Our Products
            </a>
          </li>
          <li>
            <a href="/blacktea" className="hover:text-green-300 underline underline-offset-4 decoration-green-500">
              Black Tea
            </a>
          </li>
          <li>
            <a href="/NewsPage" className="hover:text-green-300">
              News
            </a>
          </li>
          <li>
            <a href="/ContactUspage" className="hover:text-green-300">
              Contact Us
            </a>
          </li>
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

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-green-600">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>
        <ul className="flex flex-col space-y-4 mt-6 px-4 text-lg">
          <li>
            <a
              href="/home"
              className="hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/ourStory"
              className="hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              Our Story
            </a>
          </li>
          <li>
            <a
              href="/ourOfferings"
              className="hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              Our Products
            </a>
          </li>
          <li>
            <a
              href="/NewsPage"
              className="hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              News
            </a>
          </li>
          <li>
            <a
              href="/ContactUspage"
              className="hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* HERO SLIDER */}
      <div className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center pt-20">
        {images.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.url}
              alt="Premium Black Tea"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-6xl font-bold text-center px-6">
                PREMIUM BLACK TEA
              </h1>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-5 w-full flex justify-center space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-white" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* PRODUCT SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT - IMAGE SLIDER */}
          <div className="relative">
            <img
              src={image[current].url}
              alt="Premium Black Tea"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <button
              onClick={() =>
                setCurrent((prev) => (prev - 1 + image.length) % image.length)
              }
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/40 text-white px-3 py-1"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % image.length)}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/40 text-white px-3 py-1"
            >
              Next
            </button>
          </div>

          {/* RIGHT - PRODUCT INFO */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Premium Black Tea
            </h2>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li>🌱 Rainforest Alliance Certified Tea</li>
              <li>🌱 Pure Ceylon Black Tea, rich flavor & aroma</li>
              <li>🌱 Hand-picked from Uva highlands</li>
              <li>🌱 Perfect for everyday brewing</li>
              <li>🌱 Steep 3 minutes at 95°C - 100°C</li>
              <li><a href='/join' className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg">
              Inquiry Now
            </a></li>
            </ul>

            {/* ORDER BUTTON */}
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
};

export default PremiumBlackTea;
