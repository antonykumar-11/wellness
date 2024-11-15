import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function UnderPayHead1({ options, hello }) {
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
    hello(option);
    setOpen(false);
    setSearch(option.name);
  };

  return (
    <div className="relative w-full">
      <div id={`Select-${id}`} className="relative w-full">
        <input
          className="flex items-center w-full border rounded-md overflow-hidden px-4 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-400 dark:border-gray-600"
          value={search}
          onClick={() => setOpen(!open)}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        {open && (
          <div
            id="options"
            className="absolute top-full left-0 mt-1 border rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-400 dark:border-gray-600 w-full z-10 shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSelectOption(option)}
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

UnderPayHead1.propTypes = {
  options: PropTypes.array.isRequired,
  hello: PropTypes.func.isRequired,
};

UnderPayHead1.defaultProps = {
  options: [],
  hello: () => {},
};

export default UnderPayHead1;
