import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function TaxRate({ options, value, onChange, hello, selectedLedger }) {
  const [search, setSearch] = useState(value);
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
    hello(option, option._id);
    onChange(option);
    setOpen(false);
    setSearch(option.name);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setOpen(true); // Open dropdown on input change
  };

  const handleDropdownToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <div className="relative w-full">
          <div
            id={`Select-${id}`}
            className="relative w-full border border-yellow-400 p-2 rounded-md"
          >
            <div className="flex items-center rounded-md justify-between overflow-hidden w-full">
              <input
                type="text"
                className="outline-none px-2 py-1 flex-grow rounded-md p-2 h-8"
                placeholder="Search..."
                value={search}
                onChange={handleInputChange}
                onFocus={handleDropdownToggle}
              />
            </div>

            {open && (
              <div
                id="options"
                className="absolute top-full left-0 mt-1 border border-gray-300 rounded-md bg-white w-full z-10 shadow-lg max-h-60 overflow-y-auto"
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
      </div>

      <div className="relative w-full lg:w-auto">
        <div className="absolute inset-y-0 left-0 flex items-center px-2 bg-gray-200 h-full rounded-l-md">
          <span className="text-gray-700">Tax Rate (%)</span>
        </div>
        <input
          type="number"
          id="taxRate"
          name="taxRate"
          value={options.taxRate}
          onChange={handleChange}
          className="block w-full lg:w-auto pl-32 pr-4 py-2 bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter tax rate"
        />
      </div>
    </div>
  );
}

TaxRate.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hello: PropTypes.func.isRequired,
  selectedLedger: PropTypes.object,
};

TaxRate.defaultProps = {
  options: [],
  value: "",
  onChange: () => {},
  hello: () => {},
  selectedLedger: null,
};

export default TaxRate;
