import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png"

const NewsPage = () => {

  const images = [
    {
      url: "https://i.guim.co.uk/img/media/c2e745690917971d84cc03d0060062de99692a63/0_86_4500_2700/master/4500.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=a2d5679c9818db2cf1fdcdd3281e2726",
    },
    {
      url: "https://www.shanteas.com/assets/shan-teas-news-and-media-banner.jpg",
    },
    {
      url: "https://uk.clipper.madriver.app/app/uploads/2019/03/why-make-the-switch-to-organic-tea-desktop-1200x600.jpg",
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
    

  // ✅ NEWS DATA WITH PDF LINKS
  const newsItems = [
    {
      id: 1,
      image: "https://bmkltsly13vb.compat.objectstorage.ap-mumbai-1.oraclecloud.com/cdn.ft.lk/assets/uploads/image_0510ecaf51.jpg",
      date: "September 5, 2025",
      title: "Annual Reports 2024/25",
      description:
        "Annual report and audited financial statements for 2024/2025, highlighting sustainability, production, and community projects.",
      pdf: "/pdfs/Bogawanthalawa-Tea-Estate-PLC-AR-2024_25.pdf",
    },
    {
      id: 2,
      image: "https://www.globalteaauction.com/wp-content/uploads/2025/05/Tea-Sustainability-in-Crisis-1024x538.png",
      date: "March 4, 2025",
      title: "Ranaya Tea taking up a global leadership role in fighting climate change",
      description:
        "Our tea estates continue to pioneer climate-positive initiatives that reduce carbon footprint while uplifting communities.",
      pdf: "/pdfs/ClimateChangeandtheResponsibilitiesofGovernments.pdf",
    },
    {
      id: 3,
      image: "https://www.gazette.lk/wp-content/uploads/5B17592011425a029347919e25D-ST_COOMBS-page-001-2.jpg",
      date: "August 30, 2025",
      title: "AGM Documents 2025",
      description:
        "Download and view our official AGM documents for 2025, including company performance, sustainability goals, and new strategies.",
      pdf: "/pdfs/AGM-2025-Rights-of-Shareholders.pdf",
    },
    {
      id: 4,
      image: "https://cdn.shopify.com/s/files/1/0065/6316/8319/files/Voya_Herbal_Teas_2048x2048.jpg?v=1621930345",
      date: "July 15, 2025",
      title: "Launching New Organic Tea Range",
      description:
        "We proudly launched our 100% certified organic tea range, focusing on sustainable farming and premium quality.",
      pdf: "/pdfs/5280-41719-2-PB-1.pdf",
    },
    {
      id: 5,
      image: "https://www.mnp.ca/-/media/images/mnp/_mgtn/siteassets/images/blog-images/2019/2392-21-corp-support-local-blog-image-jpg.jpg",
      date: "January 10, 2025",
      title: "Supporting Local Communities",
      description:
        "Ranaya Tea continues to invest in education, healthcare, and housing projects for estate families.",
      pdf: "/pdfs/The_Role_of_Local_Community_in_Enhancing_Sustainab.pdf",
    },
  ];

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirst, indexOfLast);
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
      <nav className={`fixed top-0 left-0 w-full px-6 py-4 flex bg-black/80 flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}>
        <div className="flex flex-col items-center ms-5">
          <img 
            src={assets} 
            alt="Ranaya Logo" 
            className="w-8 h-8 object-contain mb-2"
          />
          <span className="text-2xl font-bold text-green">RANAYA</span>
        </div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><a href="/home" className="hover:text-green-300">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300 underline underline-offset-4 decoration-green-500">News</a></li>
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
      {sidebarOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-full w-64 bg-green-800 text-white transform translate-x-0 transition-transform duration-300 ease-in-out z-50"
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </>
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
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-[100px] pb-10 text-center bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          UPDATES FROM THE GOLDEN VALLEY
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          While we strive to produce the best Ceylon Tea in the island, 
          <span className="font-semibold"> Ranaya Tea Factory </span> 
          is continually engaged in carrying out projects that uplift local communities 
          and conserve the environment. Find out more in our latest news.
        </p>
      </section>

      {/* NEWS GRID */}
      <section className="py-12 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* ✅ Clickable Image */}
              <a href={item.pdf} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 object-cover cursor-pointer"
                />
              </a>
              <div className="p-5 flex flex-col justify-between h-60">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
                <div className="mt-3">
                  {/* ✅ Read More */}
                  <a
                    href={item.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-green-700 font-semibold hover:text-orange-500"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center space-x-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-800 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-800 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
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

export default NewsPage;
