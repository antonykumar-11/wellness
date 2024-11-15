// import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown } from "react-icons/fa";

// const LedgerMiddleWares = ({
//   options,
//   selectedLedger,
//   mani,
//   onChange,
//   disabled,
//   themeMode = "light", // Default to light theme if not provided
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (ledger) => {
//     onChange(ledger);
//     setIsOpen(false);
//   };

//   // Define theme-based styles
//   const buttonClass = `w-full flex justify-between items-center px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//     themeMode === "dark"
//       ? "bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
//       : "bg-white text-black border-gray-300 focus:ring-indigo-500"
//   }`;

//   const dropdownClass = `absolute mt-1 w-full border rounded-md shadow-lg max-h-60 overflow-auto z-10 ${
//     themeMode === "dark"
//       ? "bg-gray-800 text-white border-gray-700"
//       : "bg-white text-black border-gray-300"
//   }`;

//   const listItemClass = `px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer ${
//     themeMode === "dark" ? "hover:bg-indigo-500" : "hover:bg-indigo-600"
//   }`;

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => setIsOpen((prev) => !prev)}
//         className={buttonClass}
//       >
//         <span>{selectedLedger?.name || mani || "Select Ledger"}</span>
//         <FaChevronDown
//           className={`transition-transform duration-200 ${
//             isOpen ? "transform rotate-180" : ""
//           }`}
//         />
//       </button>
//       {isOpen && (
//         <div className={dropdownClass}>
//           {options.length > 0 ? (
//             <ul className="py-1">
//               {options.map((ledger) => (
//                 <li
//                   key={ledger._id}
//                   onClick={() => handleSelect(ledger)}
//                   className={listItemClass}
//                 >
//                   {ledger.name}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="px-4 py-2 text-gray-500">No ledgers available</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LedgerMiddleWares;
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const LedgerMiddleWares = ({
  options,
  selectedLedger,
  mani,
  onChange,
  disabled,
  themeMode = "light", // Default to light theme if not provided
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (ledger) => {
    onChange(ledger);
    setIsOpen(false);
  };

  // Filter options based on search query
  const filteredOptions = options.filter((ledger) =>
    ledger.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define theme-based styles
  const buttonClass = `w-full flex justify-between items-center px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    themeMode === "dark"
      ? "bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
      : "bg-white text-black border-gray-300 focus:ring-indigo-500"
  }`;

  const dropdownClass = `absolute mt-1 w-full border rounded-md shadow-lg max-h-60 overflow-auto z-10 ${
    themeMode === "dark"
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-black border-gray-300"
  }`;

  const listItemClass = `px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer ${
    themeMode === "dark" ? "hover:bg-indigo-500" : "hover:bg-indigo-600"
  }`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClass}
      >
        <span>{selectedLedger?.name || mani || "Select Ledger"}</span>
        <FaChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown List with Search */}
      {isOpen && (
        <div className={dropdownClass}>
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtered Options List */}
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((ledger) => (
                <li
                  key={ledger._id}
                  onClick={() => handleSelect(ledger)}
                  className={listItemClass}
                >
                  {ledger.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500">No ledgers available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LedgerMiddleWares;
