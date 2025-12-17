import '../output.css';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import assets from "../assets/RANAYA Logo.png"
import a2 from "../assets/RANAYA Logo (3)[1].png"

const Home = () => {
  // HERO IMAGES
   const images = [
    {
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/87/29/9f/caption.jpg?w=900&h=500&s=1",
      text: "Pure & Fresh Tea From Our Factory",
    },
    {
      url: "https://www.bestoflanka.com/images/slider/dont-miss-when-in-sri-lanka/tea_experience_in_pedro_estate/01.jpg",
      text: "Handpicked Leaves, Finest Quality",
    },
    {
      url: "https://www.verifiedmarketreports.com/images/blogs/02-24/Top%207%20Trends%20In%20Tea%20Processing%20Machine.png",
      text: "Tradition Blended With Modern Techniques",
    },
  ];

  const circleImage = a2;


  const [current, setCurrent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Navbar scroll effect
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
        className={`fixed top-0 left-0 w-full px-6 bg-black/80 py-4 flex flex-wrap items-center justify-between shadow-md z-50 transition-all duration-500 ${
          navScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex flex-col items-center ms-5">
          <img 
            src={assets} 
            alt="Ranaya Logo" 
            className="w-8 h-8 object-contain mb-2"
          />
          <span className="text-2xl font-bold text-green">RANAYA</span></div>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li><a href="/home" className="hover:text-green-300 font-family: 'Playfair Display', sans-serif
          underline underline-offset-4 decoration-green-500 ">Home</a></li>
          <li><a href="/ourStory" className="hover:text-green-300 font-family: 'Montserrat', sans-serif">Our Story</a></li>
          <li><a href="/ourOfferings" className="hover:text-green-300 font-family: 'Montserrat', sans-serif">Our Products</a></li>
          <li><a href="/NewsPage" className="hover:text-green-300 font-family: 'Montserrat', sans-serif">News</a></li>
          <li><a href="/ContactUspage" className="hover:text-green-300 font-family: 'Montserrat', sans-serif">Contact Us</a></li>
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-600">
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

      {/* HERO SECTION */}
      <div className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center pt-20 bg-black/40">
        {/* Background slideshow */}
        {images.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.url})` }}
          ></div>
        ))}

        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Circle Image (Fixed on Left) */}
        <div className="relative z-10 flex items-center w-full max-w-7xl px-6">
          <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden shadow-lg">
            <img
              src={circleImage}
              alt="hero"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Block with Green Bar */}
          <div className="ml-6 md:ml-12 px-8 py-10 md:px-14 md:py-12 rounded-lg shadow-xl text-center md:text-left max-w-2xl">
            <h1 className="text-white text-8xl md:text-5xl font-bold leading-snug">
              {images[current].text}
            </h1>
          </div>
        </div>
      </div>

     {/* FACTORY DESCRIPTION */}
      <section
        id="story"
        className="relative bg-fixed bg-cover bg-center py-16 px-6 mt-1"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/10/bd/6b/10bd6bf2c6b99ce1ce927ed2eb3873b3.jpg')",
        }}
      >
        <div className="bg-black/80  bg-opacity-70 max-w-5xl mx-auto rounded-lg shadow-lg p-10 space-y-8 text-white">
          {/* Overview */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">About Our Factory</h2>
            <p className="text-lg leading-relaxed text-justify">
              Ranaya Tea Factory has been producing the finest quality Ceylon tea for decades,
              blending traditional craftsmanship with modern innovation. From hand-picked
              leaves to carefully monitored production processes, we ensure that every cup of
              tea carries freshness, purity, and an authentic Sri Lankan essence.
            </p>
          </div>

          {/* Our History */}
          <div>
            <h3 className="text-2xl font-semibold mb-3">Our History</h3>
            <p className="text-lg leading-relaxed text-justify">
              Established in the early 20th century, our tea factory has been a cornerstone
              of Sri Lanka’s tea industry. What began as a small estate has now flourished into
              a globally recognized brand. Over the years, we have preserved the rich heritage
              of Ceylon tea while embracing modern technology to meet the growing demands of
              tea lovers worldwide. Each generation of our factory workers has carried forward
              the passion and dedication to deliver tea that is both timeless and exceptional.
            </p>
          </div>

          {/* Sustainability & Community */}
          <div>
            <h3 className="text-2xl font-semibold mb-3">Sustainability & Community</h3>
            <p className="text-lg leading-relaxed text-justify">
              Beyond producing world-class tea, Ranaya Tea Factory is deeply committed to
              sustainability. We invest in eco-friendly practices such as renewable energy,
              waste reduction, and reforestation projects. Our work also extends to uplifting
              local communities by providing fair wages, housing, healthcare, and education
              opportunities to estate families who are the backbone of our success.
            </p>
          </div>

          {/* Vision & Mission */}
          <div>
            <h3 className="text-2xl font-semibold mb-3">Our Vision & Mission</h3>
            <p className="text-lg leading-relaxed text-justify">
              Our mission is to craft the finest Ceylon tea that inspires moments of joy,
              wellness, and connection across the globe. We envision a future where Ranaya Tea
              Factory stands as a global leader in sustainable tea production while continuing
              to honor the legacy of Sri Lanka’s tea heritage.
            </p>
          </div>
        </div>
      </section>

      {/* OUR OFFERINGS */}
      <section id="offerings" className="py-16 px-6 ">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Our Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/greentea">
              <img
                src="https://www.theteapalace.co.uk/cdn/shop/files/Green_TopDown_2.jpg?v=1708964869&width=1500"
                alt="Green Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Green Tea</h3>
              <p>Fresh, healthy, and full of antioxidants for a refreshing taste.</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/blacktea">
              <img
                src="https://rareteacompany.com/cdn/shop/products/Rare-Tea-Company-Rare-Sri-Lankan-Black-1200px-4.jpg?v=1748622897"
                alt="Black Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a> 
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Black Tea</h3>
              <p>Strong and bold flavor, perfect for energizing your mornings.</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/herbal">
              <img
                src="https://teacultureoftheworld.com/cdn/shop/articles/Blog-june-5-665x300_972465a5-63c7-4e46-9c93-c5321ccdf2a3.jpg?v=1670000322&width=600"
                alt="Herbal Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Herbal Tea</h3>
              <p>Natural blends of herbs and flowers for relaxation & wellness.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/green-tea">
              <img
                src="https://d1nfzpfm1g6xft.cloudfront.net/2019/12/default-header-mobile.jpg"
                alt="Green Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Tourist Experiences</h3>
              <p>Factory Tour: LKR 3,000 per person. Includes a step-by-step guided tour of how tea is produced, tea tastings, visits to a café and factory-fresh tea shop, 
                and exploration of modern manufacturing processes. Available between 8:00 a.m. and 4:30 p.m..</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/green-tea">
              <img
                src="https://pbs.twimg.com/media/Gvp0hJJXMAAFOO_?format=jpg&name=4096x4096"
                alt="Black Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Tea Tasting Sessions</h3>
              <p>Discover the unique flavors of our teas.Expert-led tasting of different grades and varieties.Learn brewing techniques and how to identify aroma, strength, and character.</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/green-tea">
              <img
                src="https://www.alveus.eu/wp-content/smush-webp/040-a.jpg.webp"
                alt="Herbal Tea"
                className="w-full h-80 object-fix cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Cultural & Heritage Insights</h3>
              <p>Learn about the history of Ceylon tea.Discover colonial influences and our local traditions.Explore tea museum-style displays and archival stories..</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS & EVENTS */}
      <section id="news" className="py-16 px-6">
        <h2 className="text-3xl text-black font-bold text-center mb-12">News & Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/NewsPage">
              <img
                src="https://bmkltsly13vb.compat.objectstorage.ap-mumbai-1.oraclecloud.com/cdn.ft.lk/assets/uploads/image_0510ecaf51.jpg"
                alt="Event"
                className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Annual Report 2024/2025</h3>
              </div>
            </a>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/NewsPage">
              <img
                src="https://stclairteas.com/wp-content/uploads/2020/03/100.jpg"
                alt="Workshop"
                className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Tea Tasting Workshop</h3>
              </div>
            </a>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="/NewsPage">
              <img
                src="https://malaysia.themispartner.com/wp-content/uploads/notice-of-meeting-malaysia.jpg"
                alt="Community"
                className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              />  
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Notice Of Meeting</h3>
              </div>
            </a>
          </div>
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

export default Home;
