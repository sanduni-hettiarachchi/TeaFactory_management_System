// src/components/Accessories/Accessories.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Items provided by the user
const SAMPLE_ITEMS = [
  { name: "Tea Pots", img: "/assets/accessories/TeaPot2.jpg" },
  { name: "Tea Warmer", img: "/assets/accessories/Warmer.jpg" },
  { name: "Tea Cups", img: "/assets/accessories/TeaCups.jpg" },
  { name: "Tea Infusers", img: "/assets/accessories/Infuser.jpg" },
  { name: "Tea Holder", img: "/assets/accessories/Holder.jpg" },
  { name: "Ecobam – Inspired Bamboo Mixer", img: "/assets/accessories/Mixer.jpg" },
  { name: "Tea Strainer", img: "/assets/accessories/Strainer.jpg" },
  { name: "Milk & Sugar Sets", img: "/assets/accessories/Sugar.jpg" },
  { name: "Tea Assortments", img: "/assets/accessories/Assort.jpg" },
];

export default function Accessories() {
  const navigate = useNavigate();
  const handleOrder = (name) => {
    navigate(`/customer/orders/new/accessories?product=${encodeURIComponent(name)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <h2
        className="mb-4 text-3xl font-extrabold text-white drop-shadow-md"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
      >
        Tea Accessories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_ITEMS.map((item) => (
          <div key={item.img}>
            <figure className="m-0">
              {/* Fixed-height image box */}
              <div className="w-full h-80 flex items-center justify-center">
                <img
                  src={item.img}
                  alt={`${item.name} image`}
                  className="h-full w-auto max-w-full object-contain bg-transparent block"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x600?text=Accessory";
                  }}
                />
              </div>

              <figcaption className="mt-3">
                <div className="flex items-center justify-center gap-2 min-h-[44px]">
                  <h5
                    className="m-0 font-bold leading-tight text-white drop-shadow-md"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {item.name}
                  </h5>
                  <button
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
                    style={{ lineHeight: 1.1 }}
                    onClick={() => handleOrder(item.name)}
                  >
                    Order
                  </button>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
