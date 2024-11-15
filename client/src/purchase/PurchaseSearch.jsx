import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function PurchaseSearch({ options, value, onChange, hello, selectedLedger }) {
  console.log("options", options);
  console.log("value", value);
  console.log("onChange", onChange);
  console.log("hello", hello);
  console.log("selectedLedger", selectedLedger);
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const [id] = useState(shortid.generate());

  // Toggle dropdown open state
  const toggleDropdown = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Close dropdown when clicking outside
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

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const query = search.toLowerCase().trim();
    return options.filter(
      (option) => option.name && option.name.toLowerCase().includes(query)
    );
  }, [options, search]);

  // Handle option selection
  const handleSelectOption = (option) => {
    hello(option, option._id);
    onChange(option);
    setOpen(false);
    setSearch(option.name);
  };

  return (
    <div className="relative w-full">
      <div id={`Select-${id}`} className="relative w-full">
        <button
          className="flex items-center w-full border border-gray-400 rounded-md overflow-hidden"
          onClick={toggleDropdown}
        >
          <input
            type="text"
            className="outline-none px-2 py-1 flex-grow h-10"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)} // Open dropdown on focus
          />
          <div className="bg-gray-200 px-4 py-2 border-l border-gray-300 h-full flex items-center">
            Debit
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
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedLedger && selectedLedger._id === option._id
                      ? "bg-gray-100"
                      : ""
                  }`}
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

PurchaseSearch.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hello: PropTypes.func,
  selectedLedger: PropTypes.object,
};

PurchaseSearch.defaultProps = {
  options: [],
  value: "",
  onChange: () => {},
  hello: () => {},
  selectedLedger: null,
};

export default PurchaseSearch;
