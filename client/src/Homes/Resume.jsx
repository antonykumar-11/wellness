import React from "react";

const PriceTable = () => {
  // Prices for each option with name broken into multiple parts and description
  const prices = [
    {
      nameParts: [
        "Oil Therapy",
        " Full Body massage",
        "Rexation",
        "total 1 Hour",
      ],

      price: 5000,
    },
    {
      nameParts: [
        "Oil Therapy & Gell",
        " Full Body massage",
        "Rexation",
        "total 1 Hour",
      ],

      price: 3000,
    },
    {
      nameParts: [
        "Oil Therapy & Gell",
        " Full Body massage",
        "Rexation",
        "total 1 Hour",
      ],

      price: 4000,
    },
  ];

  // Handle the book now action
  const handleBookNow = () => {
    // Initiate a phone call to the specified number
    const phoneNumber = "8590948110";
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <section className="w-full py-20 bg-bodyColor" id="resume">
      <div className="flex justify-center items-center text-center mb-12">
        <h2 className="text-3xl text-lightText font-bold">Our Pricing</h2>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prices.map((product) => (
          <div
            key={product.nameParts.join(" ")} // Ensure key is unique
            className="p-6 bg-gradient-to-r from-[#1e2024] to-[#23272b] rounded-lg shadow-lg text-center text-white"
          >
            <h3 className="text-2xl font-semibold">
              {product.nameParts.map((part, index) => (
                <span key={index}>
                  {part}
                  {index < product.nameParts.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className="text-sm text-gray-400 my-2">{product.description}</p>
            <p className="text-xl my-4">₹{product.price}</p>
            <button
              onClick={handleBookNow}
              className="w-full h-12 bg-[#141518] rounded-lg text-base text-gray-400 tracking-wider uppercase hover:text-white hover:bg-designColor duration-300"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceTable;
