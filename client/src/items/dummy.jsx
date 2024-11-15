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
    <div className="p-4 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Invoice Form</h2>

        {/* Company Name */}
        <div className="mb-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="custom-file-input"
            id="customFile"
            name="avatar"
          />
          <label
            htmlFor="customFile"
            className="block w-full p-2 border border-gray-300 rounded cursor-pointer"
          >
            {formData.image ? "Avatar Added" : "Choose Avatar"}
          </label>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>
        {/* Company Address */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Company Address:</legend>
          {["line1", "line2", "line3", "line4", "line5"].map((field) => (
            <input
              key={field}
              type="text"
              name={`companyAddress.${field}`}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={formData.companyAddress[field]}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

        {/* Other Details */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Other Details:</legend>
          <input
            type="text"
            name="taxInvoice"
            placeholder="Tax Invoice"
            value={formData.taxInvoice}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="invoiceNo"
            placeholder="Invoice No"
            value={formData.invoiceNo}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="panNo"
            placeholder="Pan No"
            value={formData.panNo}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="gstNo"
            placeholder="GST No"
            value={formData.gstNo}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
        </fieldset>

        {/* Billed To Address */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Billed To:</legend>
          {["line1", "line2", "line3", "line4", "line5"].map((field) => (
            <input
              key={field}
              type="text"
              name={`billedTo.${field}`}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={formData.billedTo[field]}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

        {/* Shipped To Address */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Shipped To:</legend>
          {["line1", "line2", "line3", "line4", "line5"].map((field) => (
            <input
              key={field}
              type="text"
              name={`shippedTo.${field}`}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={formData.shippedTo[field]}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

        {/* Items */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Items:</legend>
          {formData.items.map((item, index) => (
            <div key={index} className="border p-4 rounded mb-2">
              {Object.keys(item).map((field) => (
                <input
                  key={field}
                  type="text"
                  name={`items.${index}.${field}`}
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  value={item[field]}
                  onChange={(e) => handleItemChange(index, e)}
                  onKeyDown={handleKeyPress}
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => deleteItem(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Item
          </button>
        </fieldset>

        {/* Declaration */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Declaration:</legend>
          <input
            type="text"
            name="declaration"
            placeholder="Declaration"
            value={formData.declaration}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="managingDirector"
            placeholder="Managing Director"
            value={formData.managingDirector}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="signature"
            placeholder="Signature"
            value={formData.signature}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
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
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        {/* Bank Details */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold">Bank Details:</legend>
          {["name", "accountNumber", "ifsc", "branch"].map((field) => (
            <input
              key={field}
              type="text"
              name={`bankDetails.${field}`}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={formData.bankDetails[field]}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
