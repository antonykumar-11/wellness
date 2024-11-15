import React, { useState } from "react";

const SelectWithSearch = ({ options, value, onChange, placeholder }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="block w-full p-2 border border-gray-300 rounded-md bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value
          ? options.find((option) => option.id === value).name
          : placeholder}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full p-2 border-b border-gray-300 rounded-t-md"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
