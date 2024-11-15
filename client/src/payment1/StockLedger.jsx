import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import shortid from "shortid";

function StockLedger({ stocks, value, onChange, stockLedger }) {
  console.log("stock", stocks);
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const [id] = useState(shortid.generate());
  console.log("serch", search);
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

  const filteredStocks = useMemo(() => {
    if (!search) return stocks;
    return stocks.filter(
      (option) =>
        option.stockItem &&
        option.stockItem.toLowerCase().includes(search.toLowerCase())
    );
  }, [stocks, search]);

  const handleSelectOption = (option) => {
    console.log("optionhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", option);
    stockLedger(option, option._id); // Call stockLedger function with selected option and id
    onChange(option); // Call onChange function with selected option
    setOpen(false);
    setSearch(option.stockItem);
  };

  return (
    <div className="flex items-center justify-start">
      <div id={`Select-${id}`} className="relative w-full border p-2">
        <div className="flex items-center rounded-md justify-between overflow-hidden w-full">
          <input
            type="text"
            className="outline-none px-2 py-1 flex-grow rounded-md h-8"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
        {open && (
          <div className="absolute top-full left-0 mt-1 border rounded-md bg-white w-full z-10 shadow-lg max-h-60 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((option) => (
                <div
                  key={option._id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    value === option._id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option.stockItem}
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

StockLedger.propTypes = {
  stocks: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  stockLedger: PropTypes.func.isRequired,
};

StockLedger.defaultProps = {
  stocks: [],
  value: "",
  onChange: () => {},
};

export default StockLedger;
