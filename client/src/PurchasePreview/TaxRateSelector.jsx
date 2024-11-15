import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function TaxRateSelector({ options, value, onChange, hello3, selectedLedger }) {
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
    console.log("options", option);
    hello3(option, option._id);
    onChange(option);
    setOpen(false);
    setSearch(option.name);
  };

  return (
    <div className="flex items-center justify-start z-60">
      <div className="flex items-center justify-start">
        <div
          id={`Select-${id}`}
          className="relative w-full border border-yellows-400 p-2"
        >
          <div className="flex items-center rounded-md justify-between overflow-hidden w-full">
            <input
              type="text"
              className="outline-none px-2 py-1 flex-grow rounded-md p-8 h-8 outline-transparent"
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setOpen(true)}
            />
          </div>

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
    </div>
  );
}

TaxRateSelector.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

TaxRateSelector.defaultProps = {
  options: [],
  value: "",
  onChange: () => {},
};

export default TaxRateSelector;
