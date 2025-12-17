import React from "react";
import { Link } from "react-router-dom";

export default function ProductSpecificationsInfo() {
  const grades = [
    {
      key: "BOPF",
      title: "BOPF",
      img: "/assets/accessories/BOPF.jpg",
      alt: "BOPF tea leaves",
      desc:
        "BOPF consists of finely broken tea leaves that infuse quickly, producing a robust and flavorful cup. Known for its strength and brightness, it’s the preferred grade for both tea bags and a refreshing daily brew.",
    },
    {
      key: "BOP",
      title: "BOP",
      img: "/assets/accessories/BOP.jpg",
      alt: "BOP tea leaves",
      desc:
        "Broken Orange Pekoe is made from smaller, broken tea leaves that produce a strong, brisk brew with a deep color. It’s one of the most popular grades for everyday use and an essential choice for a full-bodied cup of Ceylon tea.",
    },
    {
      key: "GFOP",
      title: "GFOP / TGFOP",
      img: "/assets/accessories/GFOP.jpg",
      alt: "GFOP/TGFOP tea leaves",
      desc:
        "These are premium grades featuring golden-tipped leaves, handpicked from the youngest buds. They deliver a luxurious aroma and a rich, complex flavor — highly prized among tea connoisseurs worldwide.",
    },
    {
      key: "FOP",
      title: "FOP",
      img: "/assets/accessories/FOP.jpg",
      alt: "FOP tea leaves",
      desc:
        "Flowery Orange Pekoe consists of long, wiry leaves with delicate golden tips. It offers a floral aroma and a light, refined taste — perfect for tea lovers seeking elegance and subtlety in every cup.",
    },
    {
      key: "OP",
      title: "OP",
      img: "/assets/accessories/OP.jpg",
      alt: "OP tea leaves",
      desc:
        "Orange Pekoe is a high-quality whole-leaf tea made from young, tender leaves. It brews a bright, clear liquor with a smooth and balanced flavor, ideal for those who appreciate classic Ceylon tea richness.",
    },
  ];

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-green-600 text-xl font-semibold">Tea Grade Specifications</h3>
        <Link
          to="/customer/dashboard"
          className="px-3 py-1 border border-gray-400 text-gray-600 rounded hover:bg-gray-100 transition"
        >
          Back
        </Link>
      </div>

      <p className="text-gray-500 mb-6">
        Explore common tea grades. Click a specification in the order form and refer here for guidance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((g) => (
          <div key={g.key} className="bg-white shadow-md rounded-md overflow-hidden h-full flex flex-col">
            <img
              src={g.img}
              alt={g.alt}
              className="w-full"
              style={{ objectFit: "cover", height: 220 }}
            />
            <div className="p-4 flex-1 flex flex-col">
              <h5 className="text-lg font-semibold mb-2">{g.title}</h5>
              <p className="text-gray-700 text-justify flex-1">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
