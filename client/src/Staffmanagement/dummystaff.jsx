mport { useState, useEffect, useRef } from "react";
import { useCreateEmployeeMutation } from "../store/api/StaffApi";
import { useGetTaxesQuery } from "../store/api/TaxApi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useGetGroupsQuery } from "../store/api/Group";
import UnderPayHead1 from "../Staffmanagement/UderPayHead1";
import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
const CreateEmployeeForm = () => {
  const dropdownRef = useRef(null);
  const [createEmployee] = useCreateEmployeeMutation();
  const [createLedger] = useCreateLedgerMutation();
  const [formData, setFormData] = useState({
    employeeRegistration: {
      registrationType: "employee",
      name: "",
      designation: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      fatherOrMotherName: "",
      spouseName: "",
      contact: { phone: "", email: "" },
      bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
      incomeTaxPAN: "",
      aadhaarCard: "",
      pfAccountNumber: "",
      prAccountNumber: "",
      under: "",
      esiNumber: "",
      dateOfHire: "",
      salary: 0,
      status: "active",
      attendance: "Present",
      registrationType: "employee",
      basicPay: 0,
      DA: 0,
      HRA: 0,
      overtime: 0,
      EPF: 0,
      ESI: 0,
      conveyance: 0,
      tax: 0,
      advance: 0,
    },
    under: "",
    name: "",
    group: "",
  });
  console.log("formData", formData);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );
  const { data: ledgers } = useGetTaxesQuery();
  const { data: groups = [], error, isLoading } = useGetGroupsQuery();

  // State to manage the selected group, search term, and dropdown visibility
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split("."); // Split the name to determine the nesting level

    if (keys.length > 1) {
      // Handle nested fields
      setFormData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      // Handle non-nested fields
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

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

  const handleDropdownChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setFormData((prevState) => ({
      ...prevState,
      employeeRegistration: {
        ...prevState.employeeRegistration,
        under: selectedOption._id,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData instance
      const formDataToSubmit = new FormData();

      // Append employee registration fields
      Object.keys(formData.employeeRegistration).forEach((key) => {
        const value = formData.employeeRegistration[key];
        if (typeof value === "object" && value !== null) {
          Object.keys(value).forEach((subKey) => {
            formDataToSubmit.append(`${key}.${subKey}`, value[subKey]);
          });
        } else {
          formDataToSubmit.append(key, value);
        }
      });

      // Append avatar if present
      if (avatar) {
        formDataToSubmit.append("avatar", avatar); // Ensure this matches server expectations
      }

      // Submit employee data
      await createEmployee(formDataToSubmit).unwrap();

      // Optional: Create a ledger if 'under' is provided
      if (formData.employeeRegistration.under) {
        const ledgerData = {
          name: formData.employeeRegistration.name,
          under: formData.employeeRegistration.under,
          // Add other fields if necessary
        };

        await createLedger(ledgerData).unwrap();
      }

      // Reset form data after successful submission
      setFormData({
        employeeRegistration: {
          name: "",
          designation: "",
          address: "",
          gender: "",
          dateOfBirth: "",
          bloodGroup: "",
          fatherOrMotherName: "",
          spouseName: "",
          contact: { phone: "", email: "" },
          bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
          incomeTaxPAN: "",
          aadhaarCard: "",
          pfAccountNumber: "",
          prAccountNumber: "",
          under: "",
          esiNumber: "",
          dateOfHire: "",
          salary: 0,
          status: "active",
          attendance: "Present",
          registrationType: "employee",
          basicPay: 0,
          DA: 0,
          HRA: 0,
          overtime: 0,
          EPF: 0,
          ESI: 0,
          conveyance: 0,
          tax: 0,
          advance: 0,
        },
        under: "",
        name: "",
        group: "",
      });

      setAvatar(null);
      setAvatarPreview("/images/default_avatar.png");
      alert("Employee saved successfully!");
    } catch (error) {
      console.error("Failed to save employee: ", error);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">
          {/* Form Fields */}
          {[
            { label: "Name", name: "employeeRegistration.name", type: "text" },
            {
              label: "Designation",
              name: "employeeRegistration.designation",
              type: "text",
            },
            {
              label: "Address",
              name: "employeeRegistration.address",
              type: "text",
            },
            {
              label: "Gender",
              name: "employeeRegistration.gender",
              type: "select",
              options: ["", "Male", "Female"],
            },
            {
              label: "Date of Birth",
              name: "employeeRegistration.dateOfBirth",
              type: "date",
            },
            {
              label: "Blood Group",
              name: "employeeRegistration.bloodGroup",
              type: "text",
            },
            {
              label: "Father/Mother Name",
              name: "employeeRegistration.fatherOrMotherName",
              type: "text",
            },
            {
              label: "Spouse Name",
              name: "employeeRegistration.spouseName",
              type: "text",
            },
            {
              label: "Phone",
              name: "employeeRegistration.contact.phone",
              type: "text",
            },
            {
              label: "Email",
              name: "employeeRegistration.contact.email",
              type: "email",
            },
            {
              label: "Bank Name",
              name: "employeeRegistration.bankDetails.bankName",
              type: "text",
            },
            {
              label: "Account Number",
              name: "employeeRegistration.bankDetails.accountNumber",
              type: "text",
            },
            {
              label: "IFSC Code",
              name: "employeeRegistration.bankDetails.ifscCode",
              type: "text",
            },
            {
              label: "Income Tax PAN",
              name: "employeeRegistration.incomeTaxPAN",
              type: "text",
            },
            {
              label: "Aadhaar Card",
              name: "employeeRegistration.aadhaarCard",
              type: "text",
            },
            {
              label: "PF Account Number",
              name: "employeeRegistration.pfAccountNumber",
              type: "text",
            },
            {
              label: "PR Account Number",
              name: "employeeRegistration.prAccountNumber",
              type: "text",
            },
            {
              label: "ESI Number",
              name: "employeeRegistration.",
              type: "text",
            },
            {
              label: "Date of Hire",
              name: "employeeRegistration.dateOfHire",
              type: "date",
            },
          ].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
                />
              )}
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Select Category
            </label>
            <UnderPayHead1
              selectedOption={formData.employeeRegistration.under}
              hello={handleDropdownChange}
              options={ledgers || []}
            />
          </div>
        </div>
        {/* Category Dropdown */}
        <div className="flex items-center justify-between">
          <div className="w-full max-w-md bg-gray-900 text-white shadow-md rounded-md ">
            <div className="flex items-center space-x-4">
              <figure className="w-24 h-24 flex-shrink-0">
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover rounded-full border border-gray-600"
                  alt="Avatar"
                />
              </figure>
              <div className="flex-1">
                {/* Hidden input field */}
                <input
                  type="file"
                  name="avatar"
                  onChange={handleImageChange}
                  className="hidden"
                  id="customFile"
                />
                {/* Custom button to trigger file input */}
                <label
                  htmlFor="customFile"
                  className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
          <div ref={dropdownRef} className="relative w-full max-w-xs mt-7">
            <div
              className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="truncate">
                {selectedGroup ? selectedGroup.name : "Select a group"}
              </span>
              {isOpen ? (
                <HiChevronUp className="text-gray-500" />
              ) : (
                <HiChevronDown className="text-gray-500" />
              )}
            </div>

            {isOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                <div className="p-2 border-b border-gray-300">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div
                        key={group._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-md shadow-md ${
                isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isLoading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeeForm;