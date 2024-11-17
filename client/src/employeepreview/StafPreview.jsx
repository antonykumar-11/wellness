import { useState, useEffect, useRef } from "react";

import { useGetTaxesQuery } from "../store/api/TaxApi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useGetGroupsQuery } from "../store/api/Group";
import UnderPayHead1 from "../employeepreview/UnderPayHead2";
// import { useUpdateLedgerMutation } from "../store/api/LedgerPayHead";

import {
  useGetLedgerQuery,
  useUpdateLedgerMutation,
} from "../store/api/LedgerApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useUpdateEmployeeByIdMutation,
  useGetEmployeeDetailsByIdQuery,
} from "../store/api/StaffApi";
const UpdateEmployeeForm = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const dropdownRef = useRef(null);

  const [updateEmployeeById] = useUpdateEmployeeByIdMutation();
  const [updateLedger] = useUpdateLedgerMutation();
  const {
    data: specificEmployee,
    isLoading: voucherLoading,
    isError: voucherError,
    refetch: refetchVoucherData,
  } = useGetEmployeeDetailsByIdQuery(employeeId || "", {
    skip: !employeeId,
  });
  const { data: getLedger } = useGetLedgerQuery(employeeId || "", {
    skip: !employeeId,
  });
  useEffect(() => {
    refetchVoucherData();
  }, [refetchVoucherData]);
  console.log("getLedger", getLedger);
  console.log("paymentVoucher", specificEmployee);
  const [formData, setFormData] = useState({
    registrationType: "employee",
    name: "",
    stockName: "",
    designation: "",
    address: "",
    gender: "",
    dateOfBirth: "", // Date of Birth field
    bloodGroup: "",
    fatherOrMotherName: "",
    spouseName: "",
    contactPhone: "",
    contactEmail: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    incomeTaxPAN: "",
    aadhaarCard: "",
    pfAccountNumber: "",
    prAccountNumber: "",
    under: "",

    esiNumber: "",
    dateOfHire: "", // Date of Hire field
    underForLedger: "",
    group: "",
    category: "",
    nature: "",
    selectedOption: "",
    ledgerId: "",
  });
  console.log("hai", formData);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );
  const { data: ledgers = [] } = useGetTaxesQuery();
  const { data: groups = [], isLoading } = useGetGroupsQuery();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleDropdownChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);

    setFormData((prevState) => ({
      ...prevState,
      under: selectedOption._id, //
      selectedOption: selectedOption.name,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("specificEmployee", specificEmployee);
  useEffect(() => {
    if (specificEmployee && getLedger && getLedger.length > 0) {
      const ledger = getLedger[0]; // Accessing the first item in the getLedger array

      setFormData((prevState) => ({
        ...prevState,
        registrationType:
          specificEmployee.registrationType || prevState.registrationType,
        name: specificEmployee.underEmployee || prevState.name,
        ledgerId: ledger._id || "",
        stockName: ledger.name || prevState.stockName,
        userName: specificEmployee.userName || specificEmployee.name,
        designation: specificEmployee.designation || prevState.designation,
        address: specificEmployee.address || prevState.address,
        gender: specificEmployee.gender || prevState.gender,
        dateOfBirth:
          formatDate(specificEmployee.dateOfBirth) || prevState.dateOfBirth, // Format Date of Birth
        bloodGroup: specificEmployee.bloodGroup || prevState.bloodGroup,
        fatherOrMotherName:
          specificEmployee.familyDetails?.fatherOrMotherName ||
          prevState.fatherOrMotherName, // Accessing nested familyDetails
        spouseName:
          specificEmployee.familyDetails?.spouseName || prevState.spouseName, // Accessing nested familyDetails
        contactPhone: specificEmployee.contact?.phone || prevState.contactPhone, // Accessing nested contact
        contactEmail: specificEmployee.contact?.email || prevState.contactEmail, // Accessing nested contact
        bankName: specificEmployee.bankDetails?.bankName || prevState.bankName, // Accessing nested bankDetails
        accountNumber:
          specificEmployee.bankDetails?.accountNumber ||
          prevState.accountNumber, // Accessing nested bankDetails
        ifscCode: specificEmployee.bankDetails?.ifscCode || prevState.ifscCode, // Accessing nested bankDetails
        incomeTaxPAN: specificEmployee.incomeTaxPAN || prevState.incomeTaxPAN,
        aadhaarCard: specificEmployee.aadhaarCard || prevState.aadhaarCard,
        pfAccountNumber:
          specificEmployee.pfAccountNumber || prevState.pfAccountNumber,
        prAccountNumber:
          specificEmployee.prAccountNumber || prevState.prAccountNumber,
        under: specificEmployee.under?._id || prevState.under,
        avatar: specificEmployee.under?.avatar || "",
        esiNumber: specificEmployee.esiNumber || prevState.esiNumber,
        dateOfHire:
          formatDate(specificEmployee.dateOfHire) || prevState.dateOfHire, // Format Date of Hire

        // Accessing data from the first ledger item in the getLedger array
        underForLedger: ledger.under || prevState.underForLedger,
        group: ledger.group || prevState.group, // Accessing ledger.group as a string
        category: ledger.category || prevState.category,
        nature: ledger.nature || prevState.nature,
      }));

      // Set avatar preview if available
      if (specificEmployee.under.avatar) {
        setAvatarPreview(specificEmployee.under.avatar);
      }
    }
  }, [specificEmployee, getLedger]); // Added getLedger to the dependency array

  // Utility function to format dates in "YYYY-MM-DD" format
  const formatDate = (date) => {
    if (!date) return ""; // Return empty string if no date
    return new Date(date).toISOString().split("T")[0]; // Format date to YYYY-MM-DD
  };

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

  const handleSelect = (group) => {
    setFormData((prevData) => ({
      ...prevData,
      underForLedger: group._id,
      group: group.name,
      nature: group.nature,
      category: group.category,
    }));
    setSelectedGroup(group);
    setIsOpen(false);
  };
  const handleGenderChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      gender: e.target.value, // Update gender selection
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure 'under' is selected before proceeding
    if (!formData.under) {
      toast.error("Please select a valid group before saving the ledger.");
      return;
    }

    try {
      // Step 1: Update Ledger
      const ledgerData = {
        payHeadType: "Staff",
        name: formData.stockName,
        under: formData.underForLedger,
        group: formData.group,
        nature: formData.nature,
        category: formData.category,
      };

      // Update the ledger
      const ledgerResponse = await updateLedger({
        id: formData.ledgerId,
        updatedPurchase: ledgerData,
      }).unwrap();

      if (ledgerResponse.payHeadType === "Staff") {
        const formDataToSubmit = new FormData();

        // Add all fields from formData to formDataToSubmit
        Object.keys(formData).forEach((key) => {
          formDataToSubmit.append(key, formData[key]);
        });

        // Add avatar if available
        if (avatar) {
          formDataToSubmit.append("avatar", avatar);
        }

        // Step 2: Update Employee record
        const employeeResponse = await updateEmployeeById({
          id: employeeId,
          data: formDataToSubmit,
        }).unwrap();

        if (employeeResponse.message === "Employee Updated Successfully") {
          // Proceed to next page without needing new data
          navigate("/staff/payHeadDetails"); // Navigate to the desired page
          resetFormData(); // Reset the form data
          toast.success("Employee updated successfully!"); // Show success toast
        }
      }
    } catch (error) {
      console.error("Failed to update ledger or employee:", error);
      const errorMessage =
        error?.data?.message || "Failed to update ledger or employee.";
      toast.error(errorMessage); // Show error toast
    }
  };

  const resetFormData = () => {
    setFormData({
      registrationType: "employee",
      name: "",
      userName: "",
      stockName: "",
      designation: "",
      address: "",
      phone: "",
      email: "",
      gender: "",
      dateOfBirth: "", // Reset Date of Birth field
      bloodGroup: "",
      fatherOrMotherName: "",
      spouseName: "",
      contactPhone: "",

      contactEmail: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      incomeTaxPAN: "",
      aadhaarCard: "",
      pfAccountNumber: "",
      prAccountNumber: "",
      under: "",
      esiNumber: "",
      dateOfHire: "", // Reset Date of Hire field
      group: "",
      category: "",
      nature: "",
    });
    setAvatar("");
    setAvatarPreview("/images/default_avatar.png");
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md  mt-10"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 sm:grid-cols-2 mb-4">
          <div className="lg:col-span-2 w-full bg-gray-900 text-white shadow-md rounded-md ">
            <div className="flex items-center space-x-4 p-4">
              <figure className="w-12 h-12 flex-shrink-0">
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover rounded-full border border-gray-600"
                  alt="Avatar"
                />
              </figure>
              <div className="flex-1">
                <input
                  type="file"
                  name="avatar"
                  onChange={handleImageChange}
                  className="hidden"
                  id="customFile"
                />
                <label
                  htmlFor="customFile"
                  className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Who is
            </label>
            <UnderPayHead1
              selectedOption={formData.under || "hai"} // Pass selected option here
              hello={handleDropdownChange} // Handles dropdown selection
              options={ledgers || []} // Options to display in dropdown
              manu={formData.name}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              For Company
            </label>
            <input
              type="text"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder="" // Optional placeholder
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold ">
              In group
            </label>
            <div
              ref={dropdownRef}
              className="relative lg:col-span-1 w-full max-w-xs mt-2"
            >
              <div
                className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {selectedGroup ? selectedGroup.name : formData.group}
                </span>

                {isOpen ? (
                  <HiChevronUp className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <HiChevronDown className="text-gray-500 dark:text-gray-400" />
                )}
              </div>

              {isOpen && (
                <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-10">
                  <div className="p-2 border-b border-gray-300 dark:border-gray-700">
                    <input
                      type="text"
                      placeholder=""
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <div
                          key={group._id}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
                          onClick={() => handleSelect(group)}
                        >
                          {console.log("group", group)}
                          {group.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 dark:text-gray-400">
                        No groups available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional fields for employee registration can be added here */}
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={handleGenderChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Hire
            </label>
            <input
              type="date"
              name="dateOfHire"
              value={formData.dateOfHire}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Father/Mother Name
            </label>
            <input
              type="text"
              name="fatherOrMotherName"
              value={formData.fatherOrMotherName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Spouse Name
            </label>
            <input
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Esi
            </label>
            <input
              type="text"
              name="esiNumber"
              value={formData.esiNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Provident Fund
            </label>
            <input
              type="text"
              name="pfAccountNumber"
              value={formData.pfAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Ifsc code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Income Tax Number
            </label>
            <input
              type="text"
              name="incomeTaxPAN"
              value={formData.incomeTaxPAN}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Adhar card
            </label>
            <input
              type="text"
              name="aadhaarCard"
              value={formData.aadhaarCard}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              PR Account Number
            </label>
            <input
              type="text"
              name="prAccountNumber"
              value={formData.prAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="flex items-center justify-between w-full ">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-md shadow-md w-full ${
                isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isLoading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEmployeeForm;
