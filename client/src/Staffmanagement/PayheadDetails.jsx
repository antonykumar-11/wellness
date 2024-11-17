import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useGetGroupsQuery } from "../store/api/Group";
import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaStar } from "react-icons/fa"; // Import star icon
import Modal from "../Modal";
import LedgerOperations from "../LedgerOperations";

const PayHeadForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch groups data from the API
  const { data: groups = [], error, isLoading } = useGetGroupsQuery();

  // State to manage the selected group, search term, and dropdown visibility
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State to manage form data
  const [formData, setFormData] = useState({
    voucherType: "",
    payHeadName: "",
    name: "",
    payHeadType: "",
    under: "", // Ledger ID
    group: "", // Ledger Name
    category: "", // Ledger category
    nature: "", // Ledger nature
    displayNameInPayslip: "",
    calculationType: "",
    newer: "", // Newer field added
  });
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  // State to manage operations and modal visibility
  const [operations, setOperations] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [createLedgerMutation, { isLoading: isAddingPayHead }] =
    useCreateLedgerMutation();

  // Filter groups based on search term
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for when the user selects an option
  const handleSelect = (group) => {
    console.log("group", group);
    setFormData({
      ...formData,
      under: group._id,
      group: group.name,
      category: group.category,
      nature: group.nature,
    });
    setSelectedGroup(group);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error loading groups</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manually set the name field to "payHead"
    const updatedFormData = {
      ...formData,
      name: formData.payHeadName, // Set the name field manually
      voucherType: "payHead",
    };

    // Validate formData
    if (!updatedFormData.under) {
      alert("Please select a valid ledger.");
      return;
    }

    try {
      const payload = { ...updatedFormData, operations };
      await createLedgerMutation(payload).unwrap();

      // Clear the form data upon successful submission
      setFormData({
        name: "",
        payHeadName: "",
        payHeadType: "",
        under: "",
        group: "",
        category: "",
        nature: "",
        displayNameInPayslip: "",
        calculationType: "",
        newer: "",
      });
      setOperations([]); // Reset operations

      alert("Pay Head saved successfully!");
    } catch (error) {
      console.error("Failed to save the pay head: ", error);
      alert("Failed to save pay head.");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveOperations = (newOperations) => {
    setOperations(newOperations);
  };

  // Navigate to payheaddetails page
  const handleIconClick = () => {
    navigate("/payheaddetails");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-full max-w-3xl relative"
      >
        {/* Add icon button */}
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400"
        >
          <FaStar className="text-xl" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="payHeadName"
              name="payHeadName"
              value={formData.payHeadName}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="payHeadType"
              className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
            >
              Pay Head Type
            </label>
            <select
              id="payHeadType"
              name="payHeadType"
              value={formData.payHeadType}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              required
            >
              <option value="">Select Pay Head Type</option>
              <option value="Earnings for Employees">Earnings</option>
              <option value="Deductions from Employees">Deductions</option>
              <option value="Loans and Advances">Loans and Advances</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="displayNameInPayslip"
              className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
            >
              Display Name In Payslip
            </label>
            <input
              type="text"
              id="displayNameInPayslip"
              name="displayNameInPayslip"
              value={formData.displayNameInPayslip}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label
              htmlFor="calculationType"
              className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
            >
              Calculation Type
            </label>
            <select
              id="calculationType"
              name="calculationType"
              value={formData.calculationType}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Calculation Type</option>
              <option value="As Computed Value">As Computed Value</option>
              <option value="As User Defined Value">
                As User Defined Value
              </option>
              <option value="Flat Rate">Flat Rate</option>
              <option value="On Attendance">On Attendance</option>
              <option value="On Production">On Production</option>
              <option value="Vehicle Salary">Vehicle Salary</option>
              <option value="As Manual Value">Manual Value</option>
            </select>
          </div>

          <div
            ref={dropdownRef}
            className="relative w-full max-w-xs mt-7 dark:bg-gray-700 "
          >
            <div
              className="flex items-center justify-between p-2 border dark:bg-gray-700  border-gray-300 rounded bg-white cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="truncate">
                {selectedGroup ? selectedGroup.name : "Select a group"}
              </span>
              {isOpen ? (
                <HiChevronUp className="text-gray-500 dark:bg-gray-700 " />
              ) : (
                <HiChevronDown className="text-gray-500 dark:bg-gray-700 " />
              )}
            </div>

            {isOpen && (
              <div className="absolute w-full mt-1 bg-white border dark:bg-gray-700  border-gray-300 rounded shadow-lg z-10">
                <div className="p-2 border-b border-gray-300">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-1 border border-gray-300 dark:bg-gray-700  rounded"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto dark:bg-gray-700 ">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div
                        key={group._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer dark:bg-gray-700 "
                        onClick={() => handleSelect(group)}
                      >
                        {group.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No groups available</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="newer"
              className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
            >
              compute your value
            </label>
            <input
              type="text"
              id="newer"
              name="newer"
              value={formData.newer}
              onClick={handleOpenModal}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 cursor-pointer"
              readOnly
            />
          </div>
        </div>
        {askHelp && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
            <div className="bg-white lg:mr-24 rounded-lg p-6 md:p-8 max-w-lg md:max-w-6xl mx-auto relative shadow-lg border border-blue-300">
              <button
                onClick={closeModalAsk} // Close modal when "Thank You" is clicked
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Thank You
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-blue-600 tracking-wide">
                Information Guide
              </h2>
              <div className="overflow-y-auto max-h-[70vh]">
                {" "}
                {/* Limit height for scrolling */}
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">name :</span>നമ്മുടെ
                  കമ്പനിയിലെ സാലറി മുഴുവൻ നമ്മൾ ഓരോ ഹെഡ് ആയിട്ടാണ് കാണേണ്ടത്
                  .അത് കൊണ്ട് ഓരോ ഹെഡിനും നമ്മൾ നമുക്കിഷ്ടമുള്ള അനുയോജ്യമായ പേര്
                  കൊടുക്കാം . ഉദാഹരണത്തിന് സാലറി കൊടുക്കുന്നു എങ്കിൽ Basic pay ,
                  Salary , Salary Account ആയിട്ടോ അഡ്വാൻസ് കൊടുക്കുന്നെങ്കിൽ
                  Salary Advance , Advance ആയിട്ടോ rent കൊടുക്കുന്നെങ്കിൽ Basic
                  Rent , Rent ആയിട്ടോ നമുക്കിഷ്ടമുള്ള അനുയോജ്യമായ പേര് കൊടുക്കാം
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Pay Head Type :</span> ഇവിടെ
                  നമ്മൾ ഉണ്ടാക്കിയ ഓരോ ഹെഡും നമ്മുടെ ജോലിക്കാർക്ക് എന്താണെന്നു
                  പറയണം .Earnings എന്നാൽ ജോലിക്കാരന് കിട്ടുന്ന ശമ്പളം . എന്നാൽ
                  ശമ്പളത്തിൽ നിന്നും എന്തെങ്കിലും കുറയ്ക്കുന്നെങ്കിൽ അത്
                  Deduction. എന്നാൽ നമ്മുടെ കൈയിൽനിന്നും എന്തെങ്കിലും
                  വാങ്ങിയിട്ടുണ്ടെങ്കിൽ അത് Loans and Advance.ഉദാഹരണത്തിന് basic
                  Pay ജോലിക്കാർക്കു Earnings ആണ് എന്നാൽ അഡ്വാൻസ് Loans and
                  Advance ആണ് എന്നാൽ TDX Deduction ആണ്
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">
                    Display Name In Payslip:
                  </span>
                  ഈ ജോലിക്കാരന് Salary Slip കാണിക്കുമ്പോൾ എന്തായി പ്രിന്റ് (
                  print) ആകണമെന്ന് ഇവിടെ പറയണം .പൊതുവെ name എന്താണോ അത് തന്നെ
                  ഇവിടെ കൊടുക്കണം
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  നമ്മൾ ഒരു ജോലിക്കാരന് അവന്റെ ഒരു മാസത്തെ ശമ്പളം 25000 ആണെന്ന്
                  തീരുമാനിച്ചു . അപ്പോൾ അതിനെ basic pay (name) എന്ന പേരിൽ
                  Earnings എന്ന (Pay Head Type) ൽ As User Defined Value ( ഈ
                  ജോലിക്കാരന്റെ മാസശമ്പളം മുതലാളി തീരുമാനിക്കുന്നു ) എന്ന
                  Calculation Type ൽ Indirect Expenses ( കമ്പനിയ്ക്കു ഇതൊരു
                  ചിലവാണ് എന്ന് പറയുന്നത് )
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  നമ്മൾ ഒരു വാഹനം വാടകയ്ക്കു തന്ന ആളിന് അവന്റെ ഒരു മാസത്തെ
                  ശമ്പളം 25000 ആണെന്ന് തീരുമാനിച്ചു . അപ്പോൾ അതിനെ basic Rent
                  (name) എന്ന പേരിൽ Earnings എന്ന (Pay Head Type) ൽ Manual Value
                  ( ഈ ജോലിക്കാരന്റെ മാസശമ്പളം മുതലാളി തീരുമാനിക്കുന്നു ) എന്ന
                  Calculation Type ൽ Indirect Expenses ( കമ്പനിയ്ക്കു ഇതൊരു
                  ചിലവാണ് എന്ന് പറയുന്നത് )
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">
                    Display Name In Payslip:
                  </span>
                  ഈ ജോലിക്കാരന് Salary Slip കാണിക്കുമ്പോൾ എന്തായി പ്രിന്റ് (
                  print) ആകണമെന്ന് ഇവിടെ പറയണം .പൊതുവെ name എന്താണോ അത് തന്നെ
                  ഇവിടെ കൊടുക്കണം
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  നമ്മൾ ഒരു വാഹനം വാടകയ്ക്കു തന്ന ആളിനോ ഡ്രൈവറിനോ 5000 രൂപ
                  അഡ്വാൻസ് കൊടുത്തു .അപ്പോൾ അതിനെ SalaryAdvance (name) എന്ന
                  പേരിൽ Loans And Advances എന്ന (Pay Head Type) ൽ Flat Rate ( ഈ
                  ജോലിക്കാരന് എത്ര കൊടുത്തു എന്ന് മുതലാളി തീരുമാനിക്കുന്നു )
                  എന്ന Calculation Type ൽ Loans And Advances ന്റെ കീഴിൽ (
                  കമ്പനിയ്ക്കു ഇതൊരു സ്വത്താണ് എന്ന് പറയുന്നത് )
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  നമ്മൾ ഒരു വാഹനം വാടകയ്ക്കു തന്ന ആളിനോ ഡ്രൈവറിനോ over time
                  കൊടുക്കുന്നെങ്കിൽ .അപ്പോൾ അതിനെ Over Time (name) എന്ന പേരിൽ
                  Earning എന്ന (Pay Head Type) ൽ on production ( ഈ ജോലിക്കാരൻ
                  എത്ര മണിക്കൂർ അധികം ജോലി ചെയ്തുവെന്ന് എന്ന് മുതലാളി
                  തീരുമാനിക്കുന്നു ) എന്ന Calculation Type ൽ IndirectExpense
                  ന്റെ കീഴിൽ ( കമ്പനിയ്ക്കു ഇതൊരു ചിലവാണ് എന്ന് പറയുന്നത് )
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  നമ്മൾ ഒരു വാഹനം വാടകയ്ക്കു തന്ന ആളിനോ ഡ്രൈവറിനോ അവർക്കു
                  കിട്ടുന്ന വരുമാനത്തിൽ നിന്നും എന്തെങ്കിലും
                  കുറയ്ക്കുന്നുണ്ടെങ്കിൽ .അപ്പോൾ അതിനെ ഉദാഹരണമായി TDX
                  കുറയ്ക്കുന്നുവെങ്കിൽ TDX (name) എന്ന പേരിൽ Deduction എന്ന (Pay
                  Head Type) ൽ As computed value ( ഈ ജോലിക്കാരന്റെ ഏതിൽ
                  നിന്നൊക്കെ കുറയ്ക്കണം എന്ന് പറഞ്ഞു കൊടുക്കുന്നത് ) എന്ന
                  Calculation Type ൽ Duties and Taxes ന്റെ കീഴിൽ ( കമ്പനിയ്ക്കു
                  ഇതൊരു ചിലവാണ് എന്ന് പറയുന്നത് ) ഇത് click compute your value
                  എന്തിൽ നിന്നും ഇത് പിടിക്കണമോ അത് പറഞ്ഞു കൊടുക്കണം
                  .ഉദാഹരണത്തിന് basic pay യിൽ നിന്നും പിടിക്കണമെങ്കിൽ compute
                  your value click ചെയ്തു Basic pay select ചെയ്തു Add opration
                  കൊടുത്തു save operation കൊടുക്കണം .
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full items-center">
          <div className="flex-1">
            <div
              onClick={openModalAsk} // On button click, open the modal
              className="bg-green-500 w-full p-2 text-white  text-center rounded hover:bg-blue-600"
            >
              Any Help
            </div>
          </div>
          <div className="flex-1">
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 dark:bg-green-700 text-white rounded "
              disabled={isAddingPayHead}
            >
              {isAddingPayHead ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          className="dark:bg-gray-700"
        >
          <LedgerOperations
            onClose={handleCloseModal}
            onSave={handleSaveOperations}
          />
        </Modal>
      </form>
    </div>
  );
};

export default PayHeadForm;
