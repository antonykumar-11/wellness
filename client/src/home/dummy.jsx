import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Home as HomeIcon,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import useTheme from "../context/Theme"; // Import the ThemeContext
import { useAuth } from "../auth/AuthContext";
import { useLogoutMutation } from "../store/api/userapi"; // Import logout mutation

function Sidebar({ isSidebarOpen }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open
  const { themeMode } = useTheme(); // Get the current theme mode
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown
  const { logout } = useAuth(); // Use auth state from AuthContext
  const [logoutApi] = useLogoutMutation(); // Initialize logout mutation

  const sidebarVariants = {
    open: {
      width: "16rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width: "4rem",
      transition: {
        damping: 40,
      },
    },
  };

  const sidebarTransition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownToggle = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown); // Open the new dropdown
    }
  };

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the new route
    setActiveDropdown(null); // Close any open dropdowns on navigation
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApi(); // Call the logout mutation
      logout(); // Call the AuthContext logout to clear local user state
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      transition={sidebarTransition}
      className={`${
        themeMode === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
      } shadow-xl z-[999] h-screen overflow-hidden fixed md:relative ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform md:translate-x-0`}
    >
      <NavLink
        to="/vouchers"
        className={`flex items-center gap-2.5 font-medium border-b ${
          themeMode === "dark" ? "border-gray-700" : "border-slate-300"
        } py-3 mx-4`}
      >
        <ShoppingBag size={28} />
        <span className={`text-xl ${!isOpen && "hidden"}`}>Inventory</span>
      </NavLink>

      <div className="flex flex-col h-full">
        <nav
          className={`whitespace-pre px-2.5 text-[.9rem] py-5 mx-2 flex flex-col gap-1 font-medium overflow-x-hidden ${
            themeMode === "dark" ? "text-gray-300" : "text-gray-900"
          }`}
        >
          <NavLink
            to="/PreviewAll"
            className={({ isActive }) =>
              isActive
                ? "link active flex items-center gap-2"
                : "link flex items-center gap-2"
            }
          >
            <HomeIcon size={23} className="min-w-max" />
            <span className={`${!isOpen && "hidden"}`}>Home</span>
          </NavLink>

          {/* Ledger Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/ledger"); // Navigate to main Ledger page
                handleDropdownToggle("ledger"); // Toggle the dropdown
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>Ledger</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "ledger" ? "rotate-180" : ""
                }`}
              />
            </div>
            {activeDropdown === "ledger" && ( // Render dropdown if open
              <motion.div
                className="ml-5 mt-1 flex flex-col"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NavLink
                  to="/ledger/option1"
                  className="block py-1 px-2 hover:bg-gray-200"
                  onClick={() => handleNavigation("/ledger/option1")}
                >
                  Option 1
                </NavLink>
                <NavLink
                  to="/ledger/option2"
                  className="block py-1 px-2 hover:bg-gray-200"
                  onClick={() => handleNavigation("/ledger/option2")}
                >
                  Option 2
                </NavLink>
              </motion.div>
            )}
          </div>
        </nav>
      </div>

      {/* Logout button */}
      <motion.div
        className="absolute bottom-16 left-0 w-full px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 w-full text-center rounded-md transition duration-300"
        >
          Logout
        </button>
      </motion.div>

      {/* Toggle Button */}
      <motion.div
        animate={isOpen ? "open" : "closed"}
        transition={sidebarTransition}
        className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer"
        onClick={toggleSidebar}
      >
        <ChevronLeft size={25} />
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;
