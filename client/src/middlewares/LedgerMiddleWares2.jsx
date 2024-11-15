// import PropTypes from "prop-types";
// import { useEffect, useMemo, useState } from "react";
// import shortid from "shortid";

// function LedgerMiddleWares({
//   options,
//   value,
//   onChange,
//   selectedLedger,
//   themeMode,
// }) {
//   const [search, setSearch] = useState(value);
//   const [open, setOpen] = useState(false);
//   const [id] = useState(shortid.generate());

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!document.getElementById(`Select-${id}`).contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [id]);

//   const filteredOptions = useMemo(() => {
//     if (!search) return options;
//     return options.filter(
//       (option) =>
//         option.name && option.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [options, search]);

//   const handleSelectOption = (option) => {
//     onChange(option); // Notify parent of selection
//     setOpen(false);
//     setSearch(option.name);
//   };

//   // Apply theme-based classes
//   const buttonClass = `flex items-center w-full border rounded-md overflow-hidden ${
//     themeMode === "dark"
//       ? "border-gray-600 bg-gray-700 text-white"
//       : "border-gray-400 bg-white text-black"
//   }`;

//   const inputClass = `outline-none px-2 py-1 flex-grow h-10 ${
//     themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
//   }`;

//   const dropdownClass = `absolute top-full left-0 mt-1 border rounded-md ${
//     themeMode === "dark"
//       ? "border-gray-600 bg-gray-800 text-white"
//       : "border-neutral-400 bg-white text-black"
//   }`;

//   const itemClass = `p-2 cursor-pointer hover:bg-gray-100 ${
//     themeMode === "dark" ? "hover:bg-gray-600" : ""
//   }`;

//   return (
//     <div className="relative w-full">
//       <div id={`Select-${id}`} className="relative w-full">
//         <button className={buttonClass} onClick={() => setOpen(!open)}>
//           <input
//             type="text"
//             className={inputClass}
//             placeholder="search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onFocus={() => setOpen(true)}
//           />
//           <div
//             className={`px-4 py-2 border-l h-full flex items-center ${
//               themeMode === "dark"
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "bg-gray-200 border-gray-300 text-black"
//             }`}
//           >
//             Credit
//           </div>
//         </button>

//         {open && (
//           <div id="options" className={dropdownClass}>
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option._id}
//                   className={`
//                     ${itemClass}
//                     ${
//                       selectedLedger && selectedLedger._id === option._id
//                         ? "bg-gray-100"
//                         : ""
//                     }
//                   `}
//                   onClick={() => handleSelectOption(option)}
//                 >
//                   {option.name}
//                 </div>
//               ))
//             ) : (
//               <div className="px-2 py-1 text-gray-500">No items found</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// LedgerMiddleWares.propTypes = {
//   options: PropTypes.array.isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   selectedLedger: PropTypes.object,
//   themeMode: PropTypes.string.isRequired, // Add themeMode to PropTypes
// };

// LedgerMiddleWares.defaultProps = {
//   options: [],
//   value: "",
//   onChange: () => {},
//   selectedLedger: null,
//   themeMode: "light", // Default to light mode
// };

// export default LedgerMiddleWares;
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

function LedgerMiddleWares2({
  options,
  value,
  onChange,
  selectedLedger,
  themeMode,
}) {
  const [search, setSearch] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
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

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(
      (option) =>
        option.name && option.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelectOption = (option) => {
    onChange(option); // Notify parent of selection
    setIsOpen(false);
    setSearch(option.name);
  };

  // Apply theme-based classes
  const buttonClass = `flex items-center w-full border rounded-md overflow-hidden ${
    themeMode === "dark"
      ? "border-gray-600 bg-gray-700 text-white"
      : "border-gray-400 bg-white text-black"
  }`;

  const inputClass = `outline-none px-2 py-1 flex-grow h-10 ${
    themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
  }`;

  const dropdownClass = `absolute top-full left-0 mt-1 w-full border rounded-md z-10 ${
    themeMode === "dark"
      ? "border-gray-600 bg-gray-800 text-white"
      : "border-neutral-400 bg-white text-black"
  }`;

  const itemClass = `p-2 cursor-pointer hover:bg-gray-100 ${
    themeMode === "dark" ? "hover:bg-gray-600" : ""
  }`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input
          type="text"
          className={inputClass}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <FaChevronDown className="ml-2" />
      </button>
      {isOpen && (
        <div className={dropdownClass}>
          {filteredOptions.map((option) => (
            <div
              key={option._id}
              className={itemClass}
              onClick={() => handleSelectOption(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

LedgerMiddleWares2.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  selectedLedger: PropTypes.object,
  themeMode: PropTypes.string.isRequired,
};

export default LedgerMiddleWares2;
