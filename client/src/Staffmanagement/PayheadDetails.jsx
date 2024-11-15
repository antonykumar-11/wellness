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

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 dark:bg-blue-700 text-white rounded mt-4"
          disabled={isAddingPayHead}
        >
          {isAddingPayHead ? "Submitting..." : "Submit"}
        </button>

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
