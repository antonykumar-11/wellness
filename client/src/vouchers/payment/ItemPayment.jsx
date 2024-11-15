// import { useState } from "react";
// import { BiTrash } from "react-icons/bi";
// import { useCreatePaymentMutation } from "../../store/api/PaymentApi";
// import shortid from "shortid";

// const ItemPayment = ({
//   handleSelect,
//   handleDeleteItem,
//   formData,
//   handleChange,
//   filteredLedgers,
//   handleInputChange,
//   items,
// }) => {
//   const [createPayment] = useCreatePaymentMutation();
//   const [showDropdown, setShowDropdown] = useState({});
//   const [focusedField, setFocusedField] = useState({});

//   const toggleDropdown = (itemId) => {
//     setShowDropdown((prev) => ({
//       ...prev,
//       [itemId]: !prev[itemId],
//     }));
//   };

//   const closeDropdown = (itemId) => {
//     setShowDropdown((prev) => ({
//       ...prev,
//       [itemId]: false,
//     }));
//   };

//   const handleFocus = (itemId, name) => {
//     setFocusedField({ itemId, name });
//     if (items.find((item) => item.id === itemId)[name] === "0") {
//       handleInputChange(itemId, name, "");
//     }
//   };

//   const handleBlur = (itemId, name) => {
//     setFocusedField({});
//     if (items.find((item) => item.id === itemId)[name] === "") {
//       handleInputChange(itemId, name, "0");
//     }
//   };

//   const handleLedgerSelect = (ledger, itemId) => {
//     console.log("name", ledger.name);
//     handleSelect(ledger, itemId, ledger.name);
//     closeDropdown(itemId);
//   };

//   return (
//     <div className="w-[95%] mx-auto mt-8 bg-slate-200 shadow-md rounded-lg">
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border border-gray-300 px-4 py-2">Sl No</th>
//               <th className="border border-gray-300 px-4 py-2">Ledger</th>
//               <th className="border border-gray-300 px-4 py-2">HSN Code</th>
//               <th className="border border-gray-300 px-4 py-2">Unit</th>
//               <th className="border border-gray-300 px-4 py-2">Quantity</th>
//               <th className="border border-gray-300 px-4 py-2">Rate</th>
//               <th className="border border-gray-300 px-4 py-2">Amount</th>
//               <th className="border border-gray-300 px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item) => (
//               <tr key={item.id} className="text-center">
//                 <td className="border border-gray-300 px-4 py-2">
//                   {item.serialNumber}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//                       placeholder="Search Ledger..."
//                       value={item.value || ""}
//                       onClick={() => toggleDropdown(item.id)}
//                       readOnly
//                     />
//                     {showDropdown[item.id] && (
//                       <div className="absolute z-10 w-full max-h-60 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto">
//                         {filteredLedgers.length === 0 ? (
//                           <div className="p-2 text-sm text-gray-500">
//                             No results found
//                           </div>
//                         ) : (
//                           filteredLedgers.map((ledger, id) => (
//                             <div
//                               key={id}
//                               className={`p-2 cursor-pointer hover:bg-gray-100 ${
//                                 item.ledger === ledger._id ? "bg-gray-100" : ""
//                               }`}
//                               onClick={() =>
//                                 handleLedgerSelect(ledger, item.id)
//                               }
//                             >
//                               {ledger.name}
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <input
//                     type="text"
//                     name="hsnCode"
//                     value={
//                       focusedField.itemId === item.id &&
//                       focusedField.name === "hsnCode"
//                         ? item.hsnCode || ""
//                         : item.hsnCode === "0" &&
//                           focusedField.name !== "hsnCode"
//                         ? ""
//                         : item.hsnCode || "0"
//                     }
//                     onChange={(e) =>
//                       handleInputChange(item.id, "hsnCode", e.target.value)
//                     }
//                     onFocus={() => handleFocus(item.id, "hsnCode")}
//                     onBlur={() => handleBlur(item.id, "hsnCode")}
//                     className="w-full px-2 py-1 border border-gray-300 rounded"
//                   />
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <input
//                     type="text"
//                     value={item.Unit}
//                     onChange={(e) =>
//                       handleInputChange(item.id, "Unit", e.target.value)
//                     }
//                     className="w-full px-2 py-1 border border-gray-300 rounded"
//                   />
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <input
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) =>
//                       handleInputChange(
//                         item.id,
//                         "quantity",
//                         parseFloat(e.target.value) || 0
//                       )
//                     }
//                     className="w-full px-2 py-1 border border-gray-300 rounded"
//                   />
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <input
//                     type="number"
//                     value={item.Rate}
//                     onChange={(e) =>
//                       handleInputChange(
//                         item.id,
//                         "Rate",
//                         parseFloat(e.target.value) || 0
//                       )
//                     }
//                     className="w-full px-2 py-1 border border-gray-300 rounded"
//                   />
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {item.Rate * item.quantity}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteItem(item.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <BiTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="w-full text-center mt-4">
//           <div className="relative w-full lg:w-auto">
//             <div className="absolute inset-y-0 left-0 flex items-center px-2 bg-gray-200 h-full rounded-l-md">
//               <span className="text-gray-700">Tax Rate (%)</span>
//             </div>
//             <input
//               type="number"
//               id="taxRate"
//               name="taxRate"
//               value={formData.taxRate}
//               onChange={handleChange}
//               className="block w-full lg:w-auto pl-32 pr-4 py-2 bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring focus:border-blue-300"
//               placeholder="Enter tax rate"
//             />
//           </div>
//         </div>
//         <div className="flex justify-center mt-4"></div>
//         <div className="flex justify-center mt-4">
//           <div className="flex flex-col justify-center pl-0 lg:pl-8 mt-6 lg:mt-0">
//             <div className="flex justify-between items-center mb-4 border-b pb-2">
//               <h5 className="text-lg font-medium">Subtotal:</h5>
//               <h5 className="text-lg font-medium">₹{formData.subTotal}</h5>
//             </div>
//             <div className="flex justify-between items-center mb-4 border-b pb-2">
//               <h5 className="text-lg font-medium">Tax:</h5>
//               <h5 className="text-lg font-medium">₹{formData.taxAmount}</h5>
//             </div>
//             <div className="flex justify-between items-center">
//               <h5 className="text-lg font-medium">Total:</h5>
//               <h5 className="text-lg font-medium">₹{formData.total}</h5>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemPayment;

import { useState } from "react";
import { BiTrash } from "react-icons/bi";

const ItemPayment = ({
  handleSelect,
  handleDeleteItem,
  formData,
  handleChange,
  filteredLedgers,
  handleInputChange,
  items,
  setItems,
}) => {
  const [showDropdown, setShowDropdown] = useState({});

  const toggleDropdown = (itemId) => {
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleLedgerSelect = (ledger, itemId) => {
    handleSelect(ledger, itemId, ledger.name);
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  };

  const calculateAmount = (rate, quantity) => {
    return rate * quantity;
  };

  const handleRateChange = (itemId, rate) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            Rate: rate,
            Amount: calculateAmount(rate, item.quantity),
          }
        : item
    );
    setItems(updatedItems);
  };

  const handleQuantityChange = (itemId, quantity) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: quantity,
            Amount: calculateAmount(item.Rate, quantity),
          }
        : item
    );
    setItems(updatedItems);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 bg-slate-200 shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Sl No</th>
              <th className="border border-gray-300 px-4 py-2">Ledger</th>
              <th className="border border-gray-300 px-4 py-2">HSN Code</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Rate</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {item.serialNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Search Ledger..."
                      value={item.value || ""}
                      onClick={() => toggleDropdown(item.id)}
                      readOnly
                    />
                    {showDropdown[item.id] && (
                      <div className="absolute z-10 w-full max-h-60 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto">
                        {filteredLedgers.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No results found
                          </div>
                        ) : (
                          filteredLedgers.map((ledger, id) => (
                            <div
                              key={id}
                              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                item.ledger === ledger._id ? "bg-gray-100" : ""
                              }`}
                              onClick={() =>
                                handleLedgerSelect(ledger, item.id)
                              }
                            >
                              {ledger.name}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="hsnCode"
                    value={item.hsnCode}
                    onChange={(e) =>
                      handleInputChange(item.id, "hsnCode", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.Unit}
                    onChange={(e) =>
                      handleInputChange(item.id, "Unit", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={item.Rate}
                    onChange={(e) =>
                      handleRateChange(item.id, parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.Amount} {/* Display Amount */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <BiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full text-center mt-4">
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center px-2 bg-gray-200 h-full rounded-l-md">
              <span className="text-gray-700">Tax Rate (%)</span>
            </div>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              className="block w-full lg:w-auto pl-32 pr-4 py-2 bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter tax rate"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex flex-col justify-center pl-0 lg:pl-8 mt-6 lg:mt-0">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h5 className="text-lg font-medium">Subtotal:</h5>
              <h5 className="text-lg font-medium">₹{formData.subTotal}</h5>
            </div>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h5 className="text-lg font-medium">Tax:</h5>
              <h5 className="text-lg font-medium">₹{formData.taxAmount}</h5>
            </div>
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-medium">Total:</h5>
              <h5 className="text-lg font-medium">₹{formData.total}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPayment;
