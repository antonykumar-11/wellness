import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useGetGroupsQuery } from "../../store/api/Group";
import useTheme from "../../context/Theme";

const Ledger = ({ closeModal, onLedgerCreate }) => {
  const { themeMode } = useTheme();
  const { data: groupsData = [], isLoading } = useGetGroupsQuery(); // Fetch groups
  const [formData, setFormData] = useState({
    voucher1: "PayMaster",
    name: "",
    group: "",
    under: "",
    category: "",
    nature: "",
    description: "",
    openingBalance: "", // Initial state for opening balance
    date: "",
  });
  console.log("formData", formData);
  const [error, setError] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "group") {
      const selectedGroup = groupsData.find((group) => group.name === value);
      if (selectedGroup) {
        setFormData((prevData) => ({
          ...prevData,
          under: selectedGroup._id,
          category: selectedGroup.category || "",
          nature: selectedGroup.nature || "",
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLedgerCreate(formData); // Call the parent callback
    } catch (err) {
      setError("Failed to create ledger");
    }
  };

  return (
    <div
      className={`fixed inset-0 ${
        themeMode === "dark"
          ? "bg-gray-800 z-10 bg-opacity-75"
          : "bg-gray-600 bg-opacity-50"
      } flex justify-center items-center`}
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          themeMode === "dark"
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900"
        } p-6 rounded-lg shadow-md max-w-lg w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Ledger</h2>
          <button onClick={closeModal}>
            <AiOutlineClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm">Ledger Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${
                themeMode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm">Group</label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${
                themeMode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <option value="">Select Group</option>
              {groupsData.map((group) => (
                <option key={group._id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm">Opening Balance</label>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${
                themeMode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>
          {/* Other form fields */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Ledger
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Ledger;
