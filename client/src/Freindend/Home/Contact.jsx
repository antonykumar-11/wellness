import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa"; // Imported Instagram instead of Twitter and LinkedIn
import contactImg from "../assets/images/contact/contactImg.png"; // Adjust path as needed

const ContactLeft = () => {
  // Handle phone call when "Book Now" button is clicked
  const handleCall = () => {
    const phoneNumber = "8129124809"; // Define the phone number
    window.location.href = `tel:${phoneNumber}`; // Initiate the call
  };

  return (
    <section
      id="contact"
      className="w-full py-20 border-b-[1px] border-b-black flex justify-center items-center"
    >
      <div className="w-full max-w-7xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Image */}
        <div className="w-full h-auto flex justify-center items-center">
          <img
            className="w-full h-64 md:h-auto object-cover rounded-lg mb-2"
            src={contactImg}
            alt="contactImg"
          />
        </div>

        {/* Right Section: Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-bold text-white">Veda Wellness</h3>

          <p className="text-base text-gray-400 tracking-wide">
            Ambadi, Pachalloor P.O., Thiruvanathapuram, Thiruvananthapuram,
            India, 695027
          </p>
          <p className="text-base text-gray-400 flex items-center gap-2">
            Phone: <span className="text-lightText">+91 8590948110</span>
          </p>
          <p className="text-base text-gray-400 flex items-center gap-2">
            Email:{" "}
            <span className="text-lightText">wellnessveda7@gmail.com</span>
          </p>

          {/* Social Media Links */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <h2 className="text-base uppercase font-titleFont mb-4">
              Find me on
            </h2>
            <div className="flex gap-6">
              {/* Facebook and Instagram Icons with clickable links */}
              <a
                href="https://www.facebook.com/profile.php?id=61567820434658"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bannerIcon text-blue-500">
                  <FaFacebookF />
                </span>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bannerIcon text-pink-500">
                  <FaInstagram />
                </span>
              </a>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="w-full mt-4">
            <button
              type="button"
              onClick={handleCall} // Trigger the call on button click
              className="w-full h-12 bg-[#141518] rounded-lg text-base text-gray-400 tracking-wider uppercase hover:text-white duration-300 hover:border-[1px] hover:border-designColor border-transparent"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactLeft;
