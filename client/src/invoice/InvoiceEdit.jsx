// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useUpdateInvoiceMutation,
//   useGetInvoiceByIdQuery,
// } from "../store/api/InvoicesApi";

// const InvoiceForm = ({ onInvoiceUpdated }) => {
//   const { id } = useParams(); // Get the invoice ID from URL parameters
//   console.log("id", id);
//   const navigate = useNavigate(); // Navigate programmatically
//   const [formData, setFormData] = useState({
//     billedTo: { line1: "", line2: "", line3: "", line4: "", line5: "" },
//     shippedTo: { line1: "", line2: "", line3: "", line4: "", line5: "" },
//     companyAddress: { line1: "", line2: "", line3: "", line4: "", line5: "" },
//     companyName: "",
//     image: "",
//     imagePosition: "left",
//     taxRate: "",
//     declaration: "",
//     managingDirector: "",
//     signature: "",
//     taxInvoice: "",
//     items: [
//       {
//         SerialNumber: "",
//         description: "",
//         hsnCode: "",
//         unit: "",
//         price: "",
//         qty: "",
//       },
//     ],
//     panNo: "",
//     gstNo: "",
//     invoiceNo: "",
//     date: "",
//     bankDetails: { name: "", accountNumber: "", ifsc: "", branch: "" },
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState("");

//   const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();

//   // Fetch existing invoice data if id is present
//   const {
//     data: existingInvoice,
//     isLoading: isFetching,
//     error,
//   } = useGetInvoiceByIdQuery(id, { skip: !id });
//   console.log("exsiting invoice", existingInvoice);
//   useEffect(() => {
//     if (existingInvoice) {
//       setFormData(existingInvoice);
//       if (existingInvoice.image) {
//         setAvatarPreview(`/path/to/images/${existingInvoice.image}`); // Adjust the path as needed
//       }
//     } else if (error) {
//       console.error("Failed to fetch invoice:", error);
//     }
//   }, [existingInvoice, error]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const [parent, child] = name.split(".");

//     if (child) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [parent]: {
//           ...prevData[parent],
//           [child]: value,
//         },
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const itemKey = name.split(".")[2];

//     setFormData((prevData) => {
//       const newItems = [...prevData.items];
//       newItems[index][itemKey] = value;
//       return { ...prevData, items: newItems };
//     });
//   };

//   const addItem = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       items: [
//         ...prevData.items,
//         {
//           SerialNumber: "",
//           description: "",
//           hsnCode: "",
//           unit: "",
//           price: "",
//           qty: "",
//         },
//       ],
//     }));
//   };

//   const deleteItem = (index) => {
//     setFormData((prevData) => {
//       const newItems = prevData.items.filter((_, i) => i !== index);
//       return { ...prevData, items: newItems };
//     });
//   };

//   const handleImageChange = (e) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatarPreview(reader.result);
//         setAvatar(e.target.files[0]);
//       }
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append("companyName", formData.companyName);
//     formDataToSend.append("image", avatar);
//     formDataToSend.append("imagePosition", formData.imagePosition);
//     formDataToSend.append("taxRate", formData.taxRate);
//     formDataToSend.append("declaration", formData.declaration);
//     formDataToSend.append("managingDirector", formData.managingDirector);
//     formDataToSend.append("signature", formData.signature);
//     formDataToSend.append("taxInvoice", formData.taxInvoice);
//     formDataToSend.append("panNo", formData.panNo);
//     formDataToSend.append("gstNo", formData.gstNo);
//     formDataToSend.append("invoiceNo", formData.invoiceNo);
//     formDataToSend.append("date", formData.date);

//     Object.entries(formData.billedTo).forEach(([key, value]) => {
//       formDataToSend.append(`billedTo[${key}]`, value);
//     });
//     Object.entries(formData.shippedTo).forEach(([key, value]) => {
//       formDataToSend.append(`shippedTo[${key}]`, value);
//     });
//     Object.entries(formData.companyAddress).forEach(([key, value]) => {
//       formDataToSend.append(`companyAddress[${key}]`, value);
//     });
//     Object.entries(formData.bankDetails).forEach(([key, value]) => {
//       formDataToSend.append(`bankDetails[${key}]`, value);
//     });

//     formData.items.forEach((item, index) => {
//       Object.entries(item).forEach(([key, value]) => {
//         formDataToSend.append(`items[${index}][${key}]`, value);
//       });
//     });

//     try {
//       await updateInvoice({ id, data: formDataToSend }).unwrap();
//       console.log("Invoice updated successfully");
//       onInvoiceUpdated(); // Notify parent to refresh the list
//       navigate("/invoices"); // Redirect to the invoices list or another page after success
//     } catch (err) {
//       console.error("Failed to update invoice:", err);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <h2 className="text-xl font-semibold mb-4">Edit Invoice</h2>

//         {/* Company Name */}
//         <div className="mb-4">
//           <input
//             type="text"
//             name="companyName"
//             placeholder="Company Name"
//             value={formData.companyName}
//             onChange={handleChange}
//             className="block w-full p-2 border border-gray-300 rounded mb-2"
//           />
//         </div>

//         {/* Image Upload */}
//         <div className="mb-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="custom-file-input"
//             id="customFile"
//             name="avatar"
//           />
//           <label
//             htmlFor="customFile"
//             className="block w-full p-2 border border-gray-300 rounded cursor-pointer"
//           >
//             {formData.image ? "Avatar Added" : "Choose Avatar"}
//           </label>
//           {avatarPreview && (
//             <img
//               src={avatarPreview}
//               alt="Avatar Preview"
//               className="mt-2 w-32 h-32 object-cover"
//             />
//           )}
//         </div>

//         {/* Company Address */}
//         <fieldset className="border p-4 rounded-lg">
//           <legend className="text-lg font-semibold">Company Address:</legend>
//           {["line1", "line2", "line3", "line4", "line5"].map((field) => (
//             <input
//               key={field}
//               type="text"
//               name={`companyAddress.${field}`}
//               placeholder={field
//                 .replace(/([A-Z])/g, " $1")
//                 .replace(/^./, (str) => str.toUpperCase())}
//               value={formData.companyAddress[field]}
//               onChange={handleChange}
//               className="block w-full p-2 border border-gray-300 rounded mb-2"
//             />
//           ))}
//         </fieldset>

//         {/* Invoice Items */}
//         {formData.items.map((item, index) => (
//           <fieldset key={index} className="border p-4 rounded-lg">
//             <legend className="text-lg font-semibold">Item {index + 1}:</legend>
//             {[
//               "SerialNumber",
//               "description",
//               "hsnCode",
//               "unit",
//               "price",
//               "qty",
//             ].map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 name={`items.${index}.${field}`}
//                 placeholder={field
//                   .replace(/([A-Z])/g, " $1")
//                   .replace(/^./, (str) => str.toUpperCase())}
//                 value={item[field]}
//                 onChange={(e) => handleItemChange(index, e)}
//                 className="block w-full p-2 border border-gray-300 rounded mb-2"
//               />
//             ))}
//             <button
//               type="button"
//               onClick={() => deleteItem(index)}
//               className="text-red-500 mt-2"
//             >
//               Remove Item
//             </button>
//           </fieldset>
//         ))}

//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Add Item
//         </button>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isUpdating}
//           className={`bg-green-500 text-white p-2 rounded ${
//             isUpdating ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isUpdating ? "Updating..." : "Update Invoice"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InvoiceForm;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useUpdateInvoiceMutation,
  useGetInvoiceByIdQuery,
} from "../store/api/InvoicesApi";

const InvoiceForm = ({ onInvoiceUpdated }) => {
  const { id } = useParams();
  const {
    data: invoiceData,
    isLoading: isFetching,
    error: fetchError,
  } = useGetInvoiceByIdQuery(id);
  const [updateInvoice, { isLoading: isUpdating, error: updateError }] =
    useUpdateInvoiceMutation();

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

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (invoiceData) {
      setFormData({
        ...invoiceData,
        billedTo: invoiceData.billedTo || {
          line1: "",
          line2: "",
          line3: "",
          line4: "",
          line5: "",
        },
        shippedTo: invoiceData.shippedTo || {
          line1: "",
          line2: "",
          line3: "",
          line4: "",
          line5: "",
        },
        companyAddress: invoiceData.companyAddress || {
          line1: "",
          line2: "",
          line3: "",
          line4: "",
          line5: "",
        },
        bankDetails: invoiceData.bankDetails || {
          name: "",
          accountNumber: "",
          ifsc: "",
          branch: "",
        },
        items: invoiceData.items || [
          {
            SerialNumber: "",
            description: "",
            hsnCode: "",
            unit: "",
            price: "",
            qty: "",
          },
        ],
      });
      setAvatarPreview(invoiceData.image || "");
    }
  }, [invoiceData]);

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(file);
      };
      reader.readAsDataURL(file);
    }
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
      await updateInvoice({ id, data: formDataToSend }).unwrap();
      onInvoiceUpdated(); // Notify parent to refresh the list or redirect
    } catch (err) {
      console.error("Failed to update invoice:", err);
    }
  };

  if (isFetching) return <p>Loading...</p>;
  if (fetchError) return <p>Error fetching invoice data.</p>;

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
            className="block w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block"
            id="customFile"
          />
          <label
            htmlFor="customFile"
            className="block p-2 border border-gray-300 rounded cursor-pointer"
          >
            {avatar ? "Avatar Added" : "Choose Avatar"}
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
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
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
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

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
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
        </fieldset>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Items:</h3>
          {formData.items.map((item, index) => (
            <fieldset key={index} className="border p-4 rounded-lg mb-4">
              <legend className="text-md font-semibold">
                Item {index + 1}
              </legend>
              {[
                "SerialNumber",
                "description",
                "hsnCode",
                "unit",
                "price",
                "qty",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={`items.${index}.${field}`}
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  value={item[field]}
                  onChange={(e) => handleItemChange(index, e)}
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
            </fieldset>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Item
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {isUpdating ? "Updating..." : "Update Invoice"}
        </button>

        {updateError && <p className="text-red-500">{updateError.message}</p>}
      </form>
    </div>
  );
};

export default InvoiceForm;
