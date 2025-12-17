import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png";

const OurStory = () => {
  // IMAGE SLIDER IMAGES
  const images = [
    {
      url: "https://tripjive.com/wp-content/uploads/2024/10/nuwara-eliya-tea-plantations-visit.jpg",
      text: "From Small Beginnings to Global Recognition",
    },
    {
      url: "https://beyondtheleaf.files.wordpress.com/2014/03/team-lumbini.jpg",
      text: "Generations Dedicated to Tea Perfection",
    },
    {
      url: "https://t3.ftcdn.net/jpg/00/80/71/78/360_F_80717866_KlL2dJT1CazArCsdPcH74sAeLMyOELEP.jpg",
      text: "Blending Tradition with Modern Innovation",
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

  const gallery = [
    {
      url: "https://heritancehotels.imgix.net/sites/8/2025/01/opti-50_1-1-tea-factory-Exterior-5.jpg?w=1920&h=920&&fit=crop&crop=center&auto=format,compress,enhance&q=50",
      title: "Secondary Processing Factory",
      description:
        "Step into our Secondary Processing Factory, where every tea leaf undergoes a journey of refinement and perfection. Combining traditional craftsmanship with modern technology, this facility ensures that each batch meets the highest global standards. From careful sorting and blending to precise packaging, every process is designed to preserve freshness, aroma, and flavor. Sustainability and hygiene are at the core of our operations, reflecting our dedication to responsible production. Visitors witness the artistry behind every cup, making this factory not just a production center but a celebration of tea excellence and global quality assurance."
    },
    {
      url: "https://select-rep.com/wp-content/uploads/select-rep-heritance-tea-factory-exterior-01.jpg",
      title: "Main Tea Factory",
      description:
        "Discover the heartbeat of our tea estate at the Main Tea Factory, where centuries-old tradition meets cutting-edge innovation. Here, hand-picked leaves are transformed through carefully controlled processes of withering, rolling, fermenting, and drying to release their signature aromas and flavors. Expert tea tasters oversee every step, ensuring perfection in every batch. Sustainability is embedded in every corner, from energy-efficient machinery to eco-conscious practices. Visiting this factory offers a behind-the-scenes experience, allowing guests to witness the dedication, precision, and passion that go into producing teas renowned for their quality, authenticity, and unforgettable taste."
    },
    {
      url: "https://heritancehotels.imgix.net/sites/8/2025/01/opti-50_1-1-Mini-Tea-Factory-2.jpg?w=1920&h=920&&fit=crop&crop=bottom&auto=compress&auto=format&auto=enhance&q=50",
      title: "Historic Tea Bungalow",
      description:
        "Step back in time at our Historic Tea Bungalow, a beautifully preserved colonial-era residence that tells the story of our estate’s rich heritage. Once home to tea planters, the bungalow now stands as a cultural landmark, offering visitors a glimpse into the past with its classic architecture, antique furnishings, and tranquil surroundings. Every corner evokes the legacy and traditions of tea cultivation, celebrating the craftsmanship and dedication that have shaped our estate. Visiting the bungalow is not just a visual delight—it’s an immersive journey into history, culture, and the timeless elegance of premium tea production."
    },
  ];

  // Set initial active index to first image
  const [activeIndex, setActiveIndex] = useState(0);
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
      <nav className={`fixed top-0 left-0 w-full px-6 py-4 flex bg-black/80  flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
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
          <li><a href="/ourStory" className="hover:text-green-300 underline underline-offset-4 decoration-green-500">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300">Our Products</a></li>
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
          <li><a href="/home" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Home</a></li>
          <li><a href="/ourStory" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>News</a></li>
          <li><a href="/ContactUspage" className="hover:text-orange-300" onClick={() => setSidebarOpen(false)}>Contact Us</a></li>
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
              alt="story"
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

      {/* OUR STORY SECTION */}
      <section className="py-8 bg-gray-100 px-6 mt-8">
        <div className="max-w-4xl mx-auto ">
          <h2 className="text-4xl font-bold text-center mb-6">Our Story</h2>
          <p className="text-lg text-justify leading-relaxed">
            Ranaya Tea Factory, founded in April 2017 by Wasantha Jayasekara, is a state-of-the-art tea production 
            facility nestled in Attampitiya in Sri Lanka’s scenic Uva planting district at 1,250 meters above sea level, 
            near Bandarawela. Renowned for its premium Uva High Grown teas, the factory has consistently set new benchmarks in quality and excellence, 
            achieving record-breaking prices at the Colombo Tea Auctions. From its first auction appearance in June 2017, where it secured an all-time record for a BM grade in the Off Grade category, to a remarkable Rs. 2,600 per kg for its BOPSp grade in September 2022, 
            Ranaya Tea Factory continues to exemplify passion, precision, and heritage in every leaf it produces.. <br /><br />
            Every leaf we harvest is a reflection of our dedication to excellence,
            blending traditional methods passed down through generations with
            modern innovations in tea production. We believe that every cup of tea
            tells a story – a story of the land, the people, and the passion that
            fuels our craft. <br /><br />
            Today, we proudly share our tea with the world, while continuing to
            support local farmers, protect the environment, and honor the heritage
            that defines us. This is not just our story – it’s the story of every
            person who has sipped and savored our tea.
          </p>
        </div>
      </section>

      {/* GALLERY WITH SHARED DESCRIPTION */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10">Our Heritage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
          {gallery.map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg cursor-pointer"
                onClick={() => setActiveIndex(index)}
              />
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
        {/* Shared description under all images */}
        <div className="max-w-4xl mx-auto mt-6 text-gray-700 text-justify text-lg">
          <p>{gallery[activeIndex].description}</p>
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
            <img 
              src={assets}
              alt="Factory Logo"
              className="w-12 h-12 mb-2"
            />
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

export default OurStory;
