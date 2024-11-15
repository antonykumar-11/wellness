import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import shortid from "shortid";
// Adjust the path as per your file structure

function PurchaseSearch2({ options, hello2 }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [id] = useState(shortid.generate());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!document.getElementById(`Select-${id}`).contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(
      (option) =>
        option.name && option.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelectOption = (option) => {
    hello2(option, option._id);
    setOpen(false);
    setSearch(option.name);
  };

  return (
    <div className="relative w-full">
      <div id={`Select-${id}`} className="relative w-full">
        <button
          className="flex items-center w-full border border-gray-400 rounded-md overflow-hidden"
          onClick={() => setOpen(!open)}
        >
          <input
            type="text"
            className="outline-none px-2 py-1 flex-grow h-10"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
          />
          <div className="bg-gray-200 px-4 py-2 border-l border-gray-300 h-full flex items-center">
            Credit
          </div>
        </button>
        {open && (
          <div
            id="options"
            className="absolute top-full left-0 mt-1 border border-neutral-400 rounded-md bg-white w-full z-10 shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectOption(option)}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500">No items found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

PurchaseSearch2.propTypes = {
  options: PropTypes.array.isRequired,
  hello2: PropTypes.func.isRequired,
  buttonledger: PropTypes.node,
};

PurchaseSearch2.defaultProps = {
  options: [],
  hello2: () => {},
  buttonledger: null,
};

export default PurchaseSearch2;
