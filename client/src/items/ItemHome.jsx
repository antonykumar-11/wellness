import { useState } from "react";
import { useCreateInvoiceMutation } from "../store/api/InvoicesApi";

const InvoiceForm = ({ onSubmit, onInvoiceCreated }) => {
  const [formData, setFormData] = useState({
    billedTo: { line1: "", line2: "", line3: "", line4: "", line5: "" },
    shippedTo: { line1: "", line2: "", line3: "", line4: "", line5: "" },
    companyAddress: { line1: "", line2: "", line3: "", line4: "", line5: "" },
    companyName: "",
    image: "",
    imagePosition: "left",
    taxRate: "",
    declaration: "",
    managingDirector: "",
    signature: "",
    taxInvoice: "",
    items: [
      {
        SerialNumber: "",
        description: "",
        hsnCode: "",
        unit: "",
        price: "",
        qty: "",
      },
    ],
    panNo: "",
    gstNo: "",
    invoiceNo: "",
    date: "",
    bankDetails: { name: "", accountNumber: "", ifsc: "", branch: "" },
  });

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [invoiceData, setInvoiceData] = useState({
    /* initial state */
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    if (child) {
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const itemKey = name.split(".")[2];

    setFormData((prevData) => {
      const newItems = [...prevData.items];
      newItems[index][itemKey] = value;
      return { ...prevData, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          SerialNumber: "",
          description: "",
          hsnCode: "",
          unit: "",
          price: "",
          qty: "",
        },
      ],
    }));
  };

  const deleteItem = (index) => {
    setFormData((prevData) => {
      const newItems = prevData.items.filter((_, i) => i !== index);
      return { ...prevData, items: newItems };
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("image", avatar);
    formDataToSend.append("imagePosition", formData.imagePosition);
    formDataToSend.append("taxRate", formData.taxRate);
    formDataToSend.append("declaration", formData.declaration);
    formDataToSend.append("managingDirector", formData.managingDirector);
    formDataToSend.append("signature", formData.signature);
    formDataToSend.append("taxInvoice", formData.taxInvoice);
    formDataToSend.append("panNo", formData.panNo);
    formDataToSend.append("gstNo", formData.gstNo);
    formDataToSend.append("invoiceNo", formData.invoiceNo);
    formDataToSend.append("date", formData.date);

    Object.entries(formData.billedTo).forEach(([key, value]) => {
      formDataToSend.append(`billedTo[${key}]`, value);
    });
    Object.entries(formData.shippedTo).forEach(([key, value]) => {
      formDataToSend.append(`shippedTo[${key}]`, value);
    });
    Object.entries(formData.companyAddress).forEach(([key, value]) => {
      formDataToSend.append(`companyAddress[${key}]`, value);
    });
    Object.entries(formData.bankDetails).forEach(([key, value]) => {
      formDataToSend.append(`bankDetails[${key}]`, value);
    });

    formData.items.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        formDataToSend.append(`items[${index}][${key}]`, value);
      });
    });

    try {
      await createInvoice(formDataToSend).unwrap();
      onInvoiceCreated(); // Notify parent to refresh the list
      console.log("Invoice created successfully");
    } catch (err) {
      console.error("Failed to create invoice:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        focusPreviousField(e);
      } else {
        focusNextField(e);
      }
    }
  };

  const focusNextField = (e) => {
    const inputs = Array.from(document.querySelectorAll("input, select"));
    const currentIndex = inputs.indexOf(e.target);
    const nextIndex = (currentIndex + 1) % inputs.length;
    inputs[nextIndex].focus();
  };

  const focusPreviousField = (e) => {
    const inputs = Array.from(document.querySelectorAll("input, select"));
    const currentIndex = inputs.indexOf(e.target);
    const prevIndex = (currentIndex - 1 + inputs.length) % inputs.length;
    inputs[prevIndex].focus();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-700 shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Invoice Form
        </h2>
        {/* Company Name */}
        <div className="mb-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-2"
          />
        </div>

        {/* Image Upload */}
        {/* Image Upload */}
        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden" // Hide default file input
            id="customFile"
            name="avatar"
          />
          <label
            htmlFor="customFile"
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {formData.image ? "Avatar Added" : "Choose Avatar"}
          </label>

          <div className="flex flex-col md:flex-row items-center mt-4">
            <img
              src={avatarPreview || "/path/to/default/image.png"} // Use your default image path here
              alt="Avatar Preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600 mb-4 md:mb-0 md:mr-4"
            />
            <span className="text-gray-600 dark:text-gray-400">
              {formData.image ? "Uploaded Image" : "No Image Uploaded"}
            </span>
          </div>
        </div>

        {/* Company Address */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Company Address:
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 dark:text-white">
            {["line1", "line2", "line3", "line4", "line5"].map((field) => (
              <input
                key={field}
                type="text"
                name={`companyAddress.${field}`}
                placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                value={formData.companyAddress[field]}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
            ))}
          </div>
        </fieldset>

        {/* Other Details */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Other Details:
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 dark:text-white">
            {[
              { name: "taxInvoice", placeholder: "Tax Invoice" },
              { name: "invoiceNo", placeholder: "Invoice No" },
              { name: "date", placeholder: "Date", type: "date" },
              { name: "panNo", placeholder: "Pan No" },
              { name: "gstNo", placeholder: "GST No" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
            ))}
          </div>
        </fieldset>

        {/* Billed To Address */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Billed To:
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 dark:text-white">
            {["line1", "line2", "line3", "line4", "line5"].map((field) => (
              <input
                key={field}
                type="text"
                name={`billedTo.${field}`}
                placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                value={formData.billedTo[field]}
                onChange={handleChange}
                className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 "
              />
            ))}
          </div>
        </fieldset>
        {/* Shipped To Address */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Shipped To:
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 dark:text-white">
            {["line1", "line2", "line3", "line4", "line5"].map((field) => (
              <input
                key={field}
                type="text"
                name={`shippedTo.${field}`}
                placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                value={formData.shippedTo[field]}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
            ))}
          </div>
        </fieldset>
        {/* Items */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Items:
          </legend>

          {formData.items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(item).map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={`items.${index}.${field}`}
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    value={item[field]}
                    onChange={(e) => handleItemChange(index, e)}
                    onKeyDown={handleKeyPress}
                    className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => deleteItem(index)}
                className="mt-4 bg-red-500 text-white p-2 rounded-md"
              >
                Delete Item
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white p-3 rounded-md"
          >
            Add Item
          </button>
        </fieldset>
        {/* Tax Rate */}
        <div className="mb-4">
          <input
            type="text"
            name="taxRate"
            placeholder="Tax Rate"
            value={formData.taxRate}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-2"
          />
        </div>

        {/* Bank Details */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Bank Details:
          </legend>

          {["name", "accountNumber", "ifsc", "branch"].map((field) => (
            <input
              key={field}
              type="text"
              name={`bankDetails.${field}`}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={formData.bankDetails[field]}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-2"
            />
          ))}
        </fieldset>

        {/* Declaration */}
        <fieldset className="border p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <legend className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Declaration:
          </legend>

          <input
            type="text"
            name="declaration"
            placeholder="Declaration"
            value={formData.declaration}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-4"
          />
          <input
            type="text"
            name="managingDirector"
            placeholder="Managing Director"
            value={formData.managingDirector}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-4"
          />
          <input
            type="text"
            name="signature"
            placeholder="Signature"
            value={formData.signature}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 mb-4"
          />
        </fieldset>

        <button
          type="submit"
          className={`w-full p-3 rounded-md text-white ${
            isCreating
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-green-500 hover:bg-green-600"
          } transition duration-200`}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
