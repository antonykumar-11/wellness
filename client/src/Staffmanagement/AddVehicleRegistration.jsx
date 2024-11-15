import { useState, useEffect, useRef } from "react";
import { useCreateEmployeeMutation } from "../store/api/StaffApi";
import { useGetTaxesQuery } from "../store/api/TaxApi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useGetGroupsQuery } from "../store/api/Group";
import UnderPayHead1 from "../Staffmanagement/UderPayHead1";
import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEmployeeForm = () => {
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [createEmployee] = useCreateEmployeeMutation();
  const [createLedger] = useCreateLedgerMutation();

  const [formData, setFormData] = useState({
    registrationType: "vehicle",
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
    underEmployee: "",
    vehicleType: "",
    vehicleRegistration: "",
    esiNumber: "",
    dateOfHire: "", // Date of Hire field
    underForLedger: "",
    group: "",
    category: "",
    nature: "",
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
      underEmployee: selectedOption.name,
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

    if (!formData.under) {
      toast.error("Please select a valid group before saving the ledger.");
      return;
    }

    try {
      const ledgerData = {
        payHeadType: "Staff",
        name: formData.stockName,
        under: formData.underForLedger,
        group: formData.group,
        nature: formData.nature,
        category: formData.category,
      };

      const ledgerResponse = await createLedger(ledgerData).unwrap();
      console.log("Ledger created successfully", ledgerResponse);

      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      if (avatar) {
        formDataToSubmit.append("avatar", avatar);
      }

      const employeeResponse = await createEmployee(formDataToSubmit).unwrap();
      navigate("/staff/payHeadDetails");
      resetFormData();
      toast.success("Employee and Ledger saved successfully!");
    } catch (error) {
      console.error("Failed to save ledger or employee: ", error);
      toast.error("Failed to save ledger or employee.");
    }
  };

  const resetFormData = () => {
    setFormData({
      registrationType: "employee",
      name: "",
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
      vehicleType: "",
      vehicleRegistration: "",
      contactEmail: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      incomeTaxPAN: "",
      aadhaarCard: "",
      pfAccountNumber: "",
      prAccountNumber: "",
      under: "",
      underEmployee: "",
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
              selectedOption={formData.under}
              hello={handleDropdownChange}
              options={ledgers || []}
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
                  {selectedGroup ? selectedGroup.name : ""}
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
              Owner Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              name="vehicleRegistration"
              value={formData.vehicleRegistration}
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
              value={formData.Email}
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

export default CreateEmployeeForm;
