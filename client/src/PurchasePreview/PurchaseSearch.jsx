import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function PurchaseSearch({
  options,
  value,
  onChange,
  hello,
  selectedLedger,
  allState,
}) {
  // Set initial state from `allState` if available
  const [search, setSearch] = useState(allState?.creditLedgerName || "");
  const [open, setOpen] = useState(false);
  const [id] = useState(shortid.generate());

  useEffect(() => {
    // Handle clicks outside the component to close the dropdown
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

  useEffect(() => {
    // Reset search value when selectedLedger or allState changes
    if (selectedLedger) {
      setSearch(selectedLedger.name || "");
    } else if (allState) {
      setSearch(allState.creditLedgerName || "");
    }
  }, [selectedLedger, allState]);

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

  return (
    <div className="relative w-full bg-red-400">
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
  hello: PropTypes.func.isRequired, // Ensure `hello` is passed and is a function
  selectedLedger: PropTypes.object,
  allState: PropTypes.object,
};

PurchaseSearch.defaultProps = {
  options: [],
  value: "",
  onChange: () => {},
  hello: () => {},
  selectedLedger: null,
  allState: {},
};

export default PurchaseSearch;
