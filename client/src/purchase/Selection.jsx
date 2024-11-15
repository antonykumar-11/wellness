// Selection.js
import React, { useState, useRef, useEffect } from "react";

const Selection = ({
  id,
  name,
  searchTerm,
  onSearchChange,
  onSelect,
  data,
  isOpen,
  toggleDropdown,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        toggleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleDropdown]);

  return (
    <div className="relative flex-1 min-w-[200px]">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
        htmlFor={id}
      >
        {name}
      </label>
      <input
        type="text"
        name={id}
        id={id}
        value={searchTerm}
        onClick={() => toggleDropdown(!isOpen)}
        onChange={(e) => onSearchChange(e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
        >
          <ul className="max-h-40 overflow-auto">
            {data.length > 0 ? (
              data.map((option) => (
                <li
                  key={option._id}
                  onClick={() => onSelect(option)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No data
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Selection;
