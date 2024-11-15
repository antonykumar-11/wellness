const LedgerInput = ({ label }) => {
  const { data: ledgerData = [] } = useGetLedgerQuery();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    setSearchTerm(selectedOption);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredData = ledgerData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-52" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={selectedOption}
        onClick={handleInputClick}
        onChange={(e) => {
          setSelectedOption(e.target.value);
          setSearchTerm(e.target.value);
        }}
        placeholder="Select or search"
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        onFocus={() => setIsDropdownOpen(true)}
      />
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 max-h-36 overflow-y-auto rounded-md">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <li
                key={item.id}
                onClick={() => handleOptionClick(item.name)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {item.name}
              </li>
            ))
          ) : (
            <li className="p-2">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

const LedgerInputWrapper = () => {
  return (
    <div className="flex flex-col space-y-4">
      <LedgerInput label="Debit" />
      <LedgerInput label="Credit" />
    </div>
  );
};

export default LedgerInputWrapper;
