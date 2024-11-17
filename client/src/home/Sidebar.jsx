import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Home as HomeIcon,
  ShoppingBag,
  ShoppingBasket,
  BarChart2,
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

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownToggle = (dropdown) => {
    // Toggle dropdowns
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActiveDropdown(null);
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
  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
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
      } shadow-xl z-[999] h-screen fixed top-0 md:relative ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform md:translate-x-0`}
    >
      <NavLink
        to="/vouchers"
        className={`flex items-center gap-2.5 font-medium border-b ${
          themeMode === "dark" ? "border-gray-700" : "border-slate-300"
        } py-3 mx-4`}
      >
        <ShoppingBasket size={28} />
        <span className={`text-xl ${!isOpen && "hidden"}`}>Invoice</span>
      </NavLink>

      <div className="flex flex-col ">
        <nav
          className={`px-2.5 text-sm py-5 mx-2 flex flex-col gap-1 font-medium ${
            themeMode === "dark" ? "text-gray-300" : "text-gray-900"
          }`}
        >
          {/* Staff Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/staff");
                handleDropdownToggle("staff");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>Staff Manageent</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "staff" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "staff" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/staff/salaryslip"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/salaryslip")}
              >
                Show Staff
              </NavLink>
              <NavLink
                to="/staff/createmainhead"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/createmainhead")}
              >
                Staff Group
              </NavLink>
              <NavLink
                to="/staff/createemployee"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/createemployee")}
              >
                Staff Category
              </NavLink>
              <NavLink
                to="/staff/payhaddetails"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/payhaddetails")}
              >
                Salary Head
              </NavLink>
              <NavLink
                to="/staff/staff"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/staff/staff")}
              >
                Create Staff
              </NavLink>
              <NavLink
                to="/staff/createvehicle"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/createvehicle")}
              >
                Create Vehicle
              </NavLink>

              <NavLink
                to="/staff/attendence"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/staff/attendence")}
              >
                Create Attendence
              </NavLink>
              <NavLink
                to="/staff/paymaster"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/staff/paymaster")}
              >
                Pay Master
              </NavLink>
              <NavLink
                to="/staff/settings"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/settings")}
              >
                Show Salary
              </NavLink>
            </motion.div>
          </div>
          {/* stock and Leder Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/stock");
                handleDropdownToggle("stock");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>Stock Manageent</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "stock" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "stock" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/stock/iddetails"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/iddetails")}
              >
                Stock Category
              </NavLink>
              <NavLink
                to="/stock/createstockgroupform"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/createstockgroupform")}
              >
                Stock Group
              </NavLink>
              <NavLink
                to="/stock/createstockitems"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/createstockitems")}
              >
                Stock Create
              </NavLink>
              <NavLink
                to="/stock/stockcategorylist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/stockcategorylist")}
              >
                show Stock category
              </NavLink>
              <NavLink
                to="/stock/stockcategorylist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/stockcategorylist")}
              >
                Stock category List
              </NavLink>

              <NavLink
                to="/stock/ledgerCreate"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/ledgerCreate")}
              >
                Ledger Grate
              </NavLink>
              <NavLink
                to="/stock/ledgerlist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/ledgerlist")}
              >
                show Ledger
              </NavLink>
            </motion.div>
          </div>
          {/* Voucher Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/vouchers");
                handleDropdownToggle("vouchers");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>Vocher Manageent</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "vouchers" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "vouchers" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/vouchers/paymentform"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/paymentform")}
              >
                Payment Voucher
              </NavLink>
              <NavLink
                to="/vouchers/sales"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/sales")}
              >
                Sales Voucher
              </NavLink>
              <NavLink
                to="/vouchers/receipt"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/receipt")}
              >
                Receipt Voucher
              </NavLink>
              <NavLink
                to="/vouchers/journal"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/journal")}
              >
                Journal Voucher
              </NavLink>
              <NavLink
                to="/vouchers/contravoucher"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/contravoucher")}
              >
                Contra Voucher
              </NavLink>

              <NavLink
                to="/vouchers/creditnote"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/creditnote")}
              >
                Credit Note
              </NavLink>
              <NavLink
                to="/vouchers/debitnote"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/vouchers/debitnote")}
              >
                Debit Note
              </NavLink>
            </motion.div>
          </div>
          {/* transactions Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/transactions");
                handleDropdownToggle("transactions");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>
                PersonalManageent
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "transactions" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "transactions" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/transactions/expensecreate"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/transactions/expensecreate")}
              >
                Create Transaction
              </NavLink>
              <NavLink
                to="/transactions/expensechart"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/transactions/expensechart")}
              >
                Transaction Dashboard
              </NavLink>
              <NavLink
                to="/transactions/expensetable"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/transactions/expensetable")}
              >
                Transaction Table
              </NavLink>
            </motion.div>
          </div>
          {/*invoice menu*/}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/invoice");
                handleDropdownToggle("invoice");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>
                Reports Manageent
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "invoice" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "invoice" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/invoice/incomemain"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/invoice/incomemain")}
              >
                Show Ledger
              </NavLink>
            </motion.div>
          </div>
          {/*report menu*/}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/reports");
                handleDropdownToggle("reports");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>
                Reports Manageent
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "reports" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "reports" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/reports/incomemain"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/reports/incomemain")}
              >
                Show Ledger
              </NavLink>
              <NavLink
                to="/reports/purchasereport"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/reports/purchasereport")}
              >
                Purchase Reports
              </NavLink>
              <NavLink
                to="/reports/droupreports"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/reports/droupreports")}
              >
                Show Groups
              </NavLink>
              <NavLink
                to="/stock/stockcategorylist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/stockcategorylist")}
              >
                show Stock category
              </NavLink>
              <NavLink
                to="/stock/stockcategorylist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/stockcategorylist")}
              >
                Stock category List
              </NavLink>

              <NavLink
                to="/stock/ledgerCreate"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/ledgerCreate")}
              >
                Ledger Grate
              </NavLink>
              <NavLink
                to="/stock/ledgerlist"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/stock/ledgerlist")}
              >
                show Ledger
              </NavLink>
            </motion.div>
          </div>
          {/* admin Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                handleNavigation("/admin");
                handleDropdownToggle("admin");
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <ShoppingBag size={23} className="min-w-max" />
              <span className={`${!isOpen && "hidden"}`}>Admin</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  activeDropdown === "admin" ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown with transition */}
            <motion.div
              variants={dropdownVariants}
              animate={activeDropdown === "admin" ? "open" : "closed"}
              className="overflow-hidden ml-6"
            >
              <NavLink
                to="/admin/balancesheet"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/balancesheet")}
              >
                Balance Sheet
              </NavLink>
              <NavLink
                to="/admin/profitandloss"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/profitandloss")}
              >
                P & L Accounts
              </NavLink>
              <NavLink
                to="/admin/createcompany"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/profitandloss")}
              >
                Create Custemers
              </NavLink>
              <NavLink
                to="/admin/companydetails"
                className="block py-1 px-2 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => handleNavigation("/admin/profitandloss")}
              >
                Custemr Details
              </NavLink>
            </motion.div>
          </div>
          {/* Stock Menu */}
        </nav>
      </div>
      {/* logout */}
      <NavLink
        onClick={handleLogout}
        className={({ isActive }) =>
          isActive
            ? "link active flex items-center absolute bottom-16 left-0 w-full px-4 gap-2 p-2 hover:bg-gray-200 rounded-md"
            : "link flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md"
        }
      >
        <BarChart2 size={23} className="min-w-max" />
        <span className={`${!isOpen && "hidden"}`}>Logout</span>
      </NavLink>
      {/* Sidebar Toggle Button */}
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
