import PropTypes from "prop-types";
import { useEffect, useMemo, useState, useCallback } from "react";
import shortid from "shortid";

// Utility for debouncing input changes
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function UnderPayHead({ options, hello }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [id] = useState(shortid.generate());
  const [focusedIndex, setFocusedIndex] = useState(-1); // For keyboard navigation

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((val) => setSearch(val), 300),
    []
  );

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

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (option) => {
      hello(option);
      setOpen(false);
      setSearch(option.name);
    },
    [hello]
  );

  // Handle keyboard navigation and selection
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      handleSelectOption(filteredOptions[focusedIndex]);
    }
  };

  return (
    <div className="relative w-full">
      <div id={`Select-${id}`} className="relative w-full">
        <input
          className="flex items-center w-full border rounded-md px-4 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-400 dark:border-gray-600"
          value={search}
          onClick={() => setOpen(!open)}
          onChange={(e) => debouncedSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          aria-expanded={open}
          aria-controls="options"
        />

        {open && (
          <div
            id="options"
            className="absolute top-full left-0 mt-1 border rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-400 dark:border-gray-600 w-full z-10 shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
            aria-activedescendant={
              focusedIndex >= 0 ? `option-${focusedIndex}` : ""
            }
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  id={`option-${index}`}
                  key={option._id}
                  role="option"
                  aria-selected={focusedIndex === index}
                  className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    focusedIndex === index ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)} // Handle hover
                >
                  {option.name}
                </div>
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500 dark:text-gray-400">
                No items found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

UnderPayHead.propTypes = {
  options: PropTypes.array.isRequired,
  hello: PropTypes.func.isRequired,
};

UnderPayHead.defaultProps = {
  options: [],
  hello: () => {},
};

export default UnderPayHead;
