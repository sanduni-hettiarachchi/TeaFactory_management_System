import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png"


const OurOfferings = () => {
  // HERO SLIDER
  const images = [
    {
      url: "https://theorganicteaproject.com/cdn/shop/articles/Teatasting_1_1125x.jpg?v=1693198341",
      text: "Crafting the Perfect Cup of Tea",
    },
    {
      url: "https://www.verifiedmarketreports.com/images/blogs/02-24/Top%207%20Trends%20In%20Tea%20Processing%20Machine.png",
      text: "Blends for Every Occasion",
    },
    {
      url: "https://dmc.dilmahtea.com/web-space/dmc/press-articles/c30749cf5bc74c7c3a7e5c8411512825e95333a8/160119778642248.jpg",
      text: "Sustainably Grown, Globally Loved",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // OFFERINGS DATA
  const offerings = [
    {
      url: "https://rareteacompany.com/cdn/shop/products/Rare-Tea-Company-Rare-Sri-Lankan-Black-1200px-4.jpg?v=1748622897",
      title: "Premium Black Tea",
      description: "Rich in flavor and aroma, carefully handpicked from our finest estates.",
      link: "/blacktea",
    },
    {
      url: "https://www.theteapalace.co.uk/cdn/shop/files/Green_TopDown_2.jpg?v=1708964869&width=1500",
      title: "Green Tea",
      description: "Naturally refreshing and packed with antioxidants for a healthy lifestyle.",
      link: "/greentea",
    },
    {
      url: "https://collectingexp.com/wp-content/uploads/IMG_1971.jpg",
      title: "Flavored Blends",
      description: "Unique blends infused with natural fruits, herbs, and spices.",
      link: "/flevored",
    },
    {
      url: "https://cdn.shopify.com/s/files/1/1576/7147/files/Sorting_Tea_leaves_large.jpg?v=1598350015",
      title: "Organic Tea",
      description: "Certified organic teas grown with sustainable farming practices.",
      link: "/organictea",
    },
    {
      url: "https://masterteafactory.com/cdn/shop/products/DSC_0014.JPG?v=1551030619&width=2400",
      title: "Herbal Infusions",
      description: "A calming collection of herbal teas crafted to soothe and energize.",
      link: "/herbal",
    },
    {
      url: "https://vietnam-tea.com/wp-content/uploads/2022/02/Kraft-paper-bag.jpg",
      title: "Loose Leaf Packs",
      description: "Premium hand-picked Ceylon teas, packed to preserve freshness and aroma. Perfect for an authentic brewing experience..",
      link: "/loose",
    },
  ];

  const [navScrolled, setNavScrolled] = useState(false);
  
    useEffect(() => {
        const handleScroll = () => {
          setNavScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full bg-black/80 px-6 py-4 flex flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`} >
        <div className="flex flex-col items-center ms-5">
          <img 
            src={assets} 
            alt="Ranaya Logo" 
            className="w-8 h-8 object-contain mb-2"
          />
          <span className="text-2xl font-bold text-green">RANAYA</span></div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><a href="/home" className="hover:text-green-300 ">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300 underline underline-offset-4 decoration-green-500">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300">News</a></li>
          <li><a href="/ContactUspage" className="hover:text-green-300">Contact Us</a></li>
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
        <button
          className="md:hidden text-2xl"
          onClick={() => setSidebarOpen(true)}
        >
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
          <li><a href="/" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Home</a></li>
          <li><a href="/ourStory" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>News</a></li>
          <li><a href="/ContactUspage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Contact Us</a></li>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
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
              alt="offerings"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-6xl font-bold text-center px-6">
                {slide.text}
              </h1>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* OFFERINGS GRID */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {offerings.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-80 object-fix"
              />
              <div className="p-6 flex flex-col justify-between h-52">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                <div className="mt-4">
                  <a
                    href={item.link}
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    View More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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

export default OurOfferings;
