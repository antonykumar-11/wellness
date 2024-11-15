// import React, { useState, useRef, useEffect } from "react";
// import { useGetLedgerQuery } from "../store/api/LedgerApi";
// import { useGetCompaniesQuery } from "../store/api/CompanyApi";
// import { useGetAllStocksQuery } from "../store/api/StockApi";
// import { useParams, useNavigate } from "react-router-dom";
// import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";
// import {
//   useGetPurchaseByIdQuery,
//   useUpdatePurchaseMutation,
//   useDeletePurchaseMutation,
// } from "../store/api/PurchaseApi";

// import CreateStockModal from "../vouchers/dummy2/CreateStock";
// import Ledger from "../vouchers/dummy2/Ledger";
// const PurchasePreview = () => {
//   const { transactionId } = useParams();
//   const { data: ledgerData = [] } = useGetLedgerQuery();
//   console.log("data", ledgerData);

//   const navigate = useNavigate();
//   const { data: stockData = [] } = useGetAllStocksQuery();
//   console.log("stock", stockData);

//   const [purchaseData, setPurchaseData] = useState({
//     voucherType: "Purchase Voucher",
//     voucherNumber: "",
//     transactionDate: "",
//     creditPeriod: "",
//     creditAmount: "",
//     creditDueDate: "",
//     purposeOfPayment: "",
//     authorizedBy: {
//       name: "",
//       designation: "",
//       signature: "",
//     },
//     purchasedBy: "",
//     purchasedTo: "",
//     description: "",
//     items: [
//       {
//         id: 1,
//         serialNumber: "1",
//         description: "",
//         unit: "",
//         hsnCode: "",
//         rate: 0,
//         quantity: 0,
//         amount: 0,

//         stockGroup: "",

//         stockName: "",
//         stockItem: "",
//       },
//     ],
//     debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
//     creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
//     taxId: "",
//     taxRate: 0,
//     taxName: "",
//     subTotal: 0,
//     taxAmount: 0,
//     total: 0,
//   });
//   console.log("purchaseDatasdtails", purchaseData);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const keys = name.split(".");

//     if (keys.length === 1) {
//       setPurchaseData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     } else {
//       setPurchaseData((prevState) => ({
//         ...prevState,
//         [keys[0]]: {
//           ...prevState[keys[0]],
//           [keys[1]]: value,
//         },
//       }));
//     }
//   };

//   const [searchTermDebit, setSearchTermDebit] = useState("");
//   const [searchTermCredit, setSearchTermCredit] = useState("");

//   const [searchTermStock, setSearchTermStock] = useState("");
//   const [purchaseToName, setPurchaseToName] = useState("");
//   const [purchaseByName, setPurchaseByName] = useState("");
//   const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState({
//     debit: false,
//     credit: false,
//     tax: false,
//     stock: false,
//     purchaseBy: false,
//     purchaseTo: false,
//   });
//   const {
//     data: paymentVoucher,
//     isLoading: voucherLoading,
//     isError: voucherError,
//     refetch: refetchVoucherData,
//   } = useGetPurchaseByIdQuery(transactionId || "", {
//     skip: !transactionId,
//   });
//   console.log("paymentVoucher", paymentVoucher);
//   useEffect(() => {
//     if (paymentVoucher) {
//       setPurchaseData({
//         ...paymentVoucher,
//         creditDueDate: new Date(paymentVoucher.creditDueDate)
//           .toISOString()
//           .split("T")[0],
//         transactionDate: new Date(paymentVoucher.transactionDate)
//           .toISOString()
//           .split("T")[0],
//       });
//       // Populate company names for display purposes
//       setPurchaseByName(paymentVoucher.purchasedBy?.companyName || "");
//       setPurchaseToName(paymentVoucher.purchasedTo?.companyName || "");
//     }
//   }, [paymentVoucher]);
//   const [updatePayment, { isLoading, isSuccess, isError, error }] =
//     useUpdatePurchaseMutation();

//   const handleSaveAndSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       // Create the payload object with correct keys
//       const payload = {
//         transactionId, // Assuming transactionId is available in your component
//         updatedPurchase: purchaseData, // Wrap purchaseData under the key updatedPurchase
//       };

//       await updatePayment(payload).unwrap();

//       // Handle successful submission (e.g., show a success message, redirect, etc.)
//       alert("Purchase updated successfully!");

//       // Optionally refetch voucher data or handle post-submit tasks
//       refetchVoucherData();

//       // Redirect to /expense/incomemain
//       navigate("/expense/incomemain");
//     } catch (err) {
//       // Handle error
//       console.error("Failed to update purchase:", err);
//     }
//   };

//   // Delete payment mutation
//   const [deletePayment] = useDeletePurchaseMutation();
//   const handleDelete = async () => {
//     console.log("Deleting payment with ID:", transactionId); // Log the ID

//     try {
//       await deletePayment(transactionId).unwrap(); // Pass transactionId directly

//       // Handle successful deletion (e.g., show a success message, redirect, etc.)
//       alert("Payment deleted successfully!");

//       // Optionally refetch voucher data or handle post-delete tasks
//       refetchVoucherData();

//       // Redirect to /expense/incomemain or any other route as needed
//       navigate("/expense/incomemain");
//     } catch (err) {
//       // Handle error
//       console.error("Failed to delete payment:", err);
//     }
//   };
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         dropdownRefs.purchaseTo.current &&
//         !dropdownRefs.purchaseTo.current.contains(e.target)
//       ) {
//         setIsDropdownOpen((prevState) => ({
//           ...prevState,
//           purchaseTo: false,
//         }));
//       }
//       if (
//         dropdownRefs.purchaseBy.current &&
//         !dropdownRefs.purchaseBy.current.contains(e.target)
//       ) {
//         setIsDropdownOpen((prevState) => ({
//           ...prevState,
//           purchaseBy: false,
//         }));
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const filteredCompanyData = (searchTerm) =>
//     companyData.filter((item) =>
//       (item.companyName || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const dropdownRefs = {
//     debit: useRef(null),
//     credit: useRef(null),
//     tax: useRef(null),
//     stock: useRef(null),
//     purchaseBy: useRef(null),
//     purchaseTo: useRef(null),
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       Object.keys(dropdownRefs).forEach((key) => {
//         if (
//           dropdownRefs[key].current &&
//           !dropdownRefs[key].current.contains(e.target)
//         ) {
//           setIsDropdownOpen((prevState) => ({
//             ...prevState,
//             [key]: false,
//           }));
//         }
//       });
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     calculateTotals();
//   }, [purchaseData.items, purchaseData.taxRate]);

//   const handleItemChange = (index, name, value) => {
//     const updatedItems = [...purchaseData.items];
//     updatedItems[index] = { ...updatedItems[index], [name]: value };

//     if (name === "rate" || name === "quantity") {
//       updatedItems[index].amount =
//         updatedItems[index].rate * updatedItems[index].quantity;
//     }

//     setPurchaseData((prevData) => ({
//       ...prevData,
//       items: updatedItems,
//     }));
//   };

//   const addItem = () => {
//     setPurchaseData((prevData) => ({
//       ...prevData,
//       items: [
//         ...prevData.items,
//         {
//           id: prevData.items.length + 1,
//           serialNumber: (prevData.items.length + 1).toString(), // Increment serial number
//           description: "",
//           unit: "",
//           hsnCode: "",
//           rate: 0,
//           quantity: 0,
//           amount: 0,
//           stockItem: "",
//           stockName: "", // Stock item dropdown
//         },
//       ],
//     }));
//   };

//   const deleteItem = (index) => {
//     setPurchaseData((prevData) => ({
//       ...prevData,
//       items: prevData.items.filter((_, i) => i !== index),
//     }));
//   };

//   const handleLedgerSelect = (type, option) => {
//     console.log("type", type);
//     console.log("option", option);

//     if (type === "credit") {
//       setPurchaseData((prevData) => {
//         const updatedCreditLedgers = [...prevData.creditLedgers];
//         const indexToUpdate = 0;

//         if (indexToUpdate < updatedCreditLedgers.length) {
//           updatedCreditLedgers[indexToUpdate] = {
//             ledgerId: option._id,
//             ledgerName: option.name,
//             amount: prevData.total || 0,
//           };
//         } else {
//           updatedCreditLedgers.push({
//             ledgerId: option._id,
//             ledgerName: option.name,
//             amount: prevData.total || 0,
//           });
//         }

//         const newPurchaseData = {
//           ...prevData,
//           creditLedgers: updatedCreditLedgers,
//           creditLedgerName: option.name,
//         };

//         // Recalculate totals
//         calculateTotals(newPurchaseData);

//         return newPurchaseData;
//       });

//       setIsDropdownOpen((prevState) => ({
//         ...prevState,
//         credit: false,
//       }));
//     } else if (type === "debit") {
//       setPurchaseData((prevData) => {
//         const updatedDebitLedgers = [...prevData.debitLedgers];
//         const indexToUpdate = 1;

//         if (indexToUpdate < updatedDebitLedgers.length) {
//           updatedDebitLedgers[indexToUpdate] = {
//             ledgerId: option._id,
//             ledgerName: option.name,
//             amount: prevData.total || 0,
//           };
//         } else {
//           updatedDebitLedgers.push({
//             ledgerId: option._id,
//             ledgerName: option.name,
//             amount: prevData.total || 0,
//           });
//         }

//         const newPurchaseData = {
//           ...prevData,
//           debitLedgers: updatedDebitLedgers,
//           debitLedgerName: option.name,
//         };

//         // Recalculate totals
//         calculateTotals(newPurchaseData);

//         return newPurchaseData;
//       });

//       setIsDropdownOpen((prevState) => ({
//         ...prevState,
//         debit: false,
//       }));
//     }
//   };

//   const handleStockSelect = (index, option) => {
//     const updatedItems = [...purchaseData.items];
//     updatedItems[index].stockItem = option._id; // Store the stock ID
//     updatedItems[index].stockName = option.stockItem; // Display the stock name
//     setPurchaseData((prevState) => ({
//       ...prevState,
//       items: updatedItems,
//     }));
//     setIsDropdownOpen({ stock: false });
//   };

//   const calculateTotals = () => {
//     const subTotal = purchaseData.items.reduce(
//       (acc, item) => acc + item.amount,
//       0
//     );
//     const taxAmount = (subTotal * purchaseData.taxRate) / 100;
//     const total = subTotal + taxAmount;

//     setPurchaseData((prevData) => ({
//       ...prevData,
//       subTotal: subTotal,
//       taxAmount: taxAmount,
//       total: total,
//       creditLedgers: prevData.creditLedgers.map((ledger, index) => {
//         if (index === 0) {
//           return {
//             ...ledger,
//             amount: total, // Assuming the first ledger on the credit side holds the total
//           };
//         }
//         return ledger;
//       }),
//       debitLedgers: prevData.debitLedgers.map((ledger, index) => {
//         if (index === 0) {
//           return {
//             ...ledger,
//             amount: taxAmount, // The first ledger on the debit side holds the tax amount
//           };
//         } else if (index === 1) {
//           return {
//             ...ledger,
//             amount: total, // The second ledger on the debit side holds the subtotal
//           };
//         }
//         return ledger;
//       }),
//     }));
//   };
//   useEffect(() => {
//     calculateTotals();
//   }, [purchaseData.items, purchaseData.taxRate]);

//   const filteredLedgerData = (searchTerm) =>
//     ledgerData.filter((item) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const filteredStockData = (searchTerm) => {
//     return stockData.filter((item) =>
//       item.stockItem.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const openLedgerModal = () => setIsLedgerModalOpen(true);
//   const closeLedgerModal = () => setIsLedgerModalOpen(false);
//   const [isModalOpeni, setIsModalOpeni] = useState(false);

//   const openModali = () => setIsModalOpeni(true);
//   const closeModali = () => setIsModalOpeni(false);

//   // State for dropdowns
//   const [taxDropdownState, setTaxDropdownState] = useState({
//     isDropdownOpen: false,
//     searchTerm: "",
//   });

//   const taxDropdownRef = useRef(null);

//   // Handler for selecting a tax option
//   const handleTaxSelect = (option) => {
//     setPurchaseData((prevData) => {
//       const updatedDebitLedgers = [...prevData.debitLedgers];
//       updatedDebitLedgers[0] = {
//         ...updatedDebitLedgers[0],
//         ledgerId: option._id,
//         ledgerName: option.name,
//         amount: prevData.taxAmount || 0, // Assign the latest tax amount
//       };

//       return {
//         ...prevData,
//         taxId: option._id,
//         taxName: option.name,
//         debitLedgers: updatedDebitLedgers,
//       };
//     });

//     setIsDropdownOpen((prevState) => ({ ...prevState, tax: false }));
//   };

//   // Filter tax data based on search term
//   const filteredTaxData = (searchTerm) =>
//     ledgerData.filter((item) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   const { data: companyData = [] } = useGetCompaniesQuery();

//   console.log("pu", purchaseData);
//   const [searchTermPurchasedBy, setSearchTermPurchasedBy] = useState("");
//   const [searchTermPurchasedTo, setSearchTermPurchasedTo] = useState("");
//   const handleSelect = (field, option) => {
//     setPurchaseData((prevState) => ({
//       ...prevState,
//       [field]: option._id, // Store the selected company's _id
//     }));
//     if (field === "purchasedBy") {
//       setPurchaseByName(option.companyName); // Store the selected company's name for display
//       setSearchTermPurchasedBy(""); // Reset search term after selection
//     } else if (field === "purchasedTo") {
//       setPurchaseToName(option.companyName); // Store the selected company's name for display
//       setSearchTermPurchasedTo(""); // Reset search term after selection
//     }
//     setIsDropdownOpen((prevState) => ({
//       ...prevState,
//       [field]: false,
//     }));
//   };

//   const handleDropdownToggle = (field) => {
//     setIsDropdownOpen((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };
//   return (
//     <div className="p-6">
//       {/* form field  */}
//       <form className="max-w-4xl mx-auto p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10 ">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
//           {/* Row 1 */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Voucher Number
//             </label>
//             <input
//               type="text"
//               name="voucherNumber"
//               value={purchaseData.voucherNumber}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Transaction Date
//             </label>
//             <input
//               type="date"
//               name="transactionDate"
//               value={purchaseData.transactionDate}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Credit Period
//             </label>
//             <input
//               type="text"
//               name="creditPeriod"
//               value={purchaseData.creditPeriod}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Row 2 */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Credit Amount
//             </label>
//             <input
//               type="number"
//               name="creditAmount"
//               value={purchaseData.creditAmount}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Credit Due Date
//             </label>
//             <input
//               type="date"
//               name="creditDueDate"
//               value={purchaseData.creditDueDate}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Purpose of Payment
//             </label>
//             <input
//               type="text"
//               name="purposeOfPayment"
//               value={purchaseData.purposeOfPayment}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Row 3 */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Authorized By Name
//             </label>
//             <input
//               type="text"
//               name="authorizedBy.name"
//               value={purchaseData.authorizedBy.name}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Designation
//             </label>
//             <input
//               type="text"
//               name="authorizedBy.designation"
//               value={purchaseData.authorizedBy.designation}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Signature
//             </label>
//             <input
//               type="text"
//               name="authorizedBy.signature"
//               value={purchaseData.authorizedBy.signature}
//               onChange={handleChange}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Row 4 */}
//           <div className="relative flex flex-col mb-4">
//             <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
//               Purchased By
//             </label>
//             <input
//               type="text"
//               value={purchaseByName} // Display the selected company's name
//               onChange={(e) => {
//                 setSearchTermPurchasedBy(e.target.value);
//                 setPurchaseByName(e.target.value);
//               }}
//               onClick={() => handleDropdownToggle("purchasedBy")}
//               className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
//             />
//             {isDropdownOpen.purchasedBy && (
//               <div
//                 ref={dropdownRefs.purchasedBy}
//                 className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
//               >
//                 <div className="p-2">
//                   {filteredCompanyData(searchTermPurchasedBy).map((item) => (
//                     <div
//                       key={item._id}
//                       onClick={() => handleSelect("purchasedBy", item)}
//                       className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
//                     >
//                       {item.companyName}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="relative flex flex-col mb-4">
//             <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
//               Purchased To
//             </label>
//             <input
//               type="text"
//               value={purchaseToName} // Display the selected company's name
//               onChange={(e) => {
//                 setSearchTermPurchasedTo(e.target.value);
//                 setPurchaseToName(e.target.value);
//               }}
//               onClick={() => handleDropdownToggle("purchasedTo")}
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
//             />
//             {isDropdownOpen.purchasedTo && (
//               <div
//                 ref={dropdownRefs.purchasedTo}
//                 className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
//               >
//                 <div className="p-2">
//                   {filteredCompanyData(searchTermPurchasedTo).map((item) => (
//                     <div
//                       key={item._id}
//                       onClick={() => handleSelect("purchasedTo", item)}
//                       className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
//                     >
//                       {item.companyName}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 dark:text-gray-300">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={purchaseData.description}
//               onChange={handleChange}
//               rows="4"
//               className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>
//       </form>
//       {/* ithu main table container*/}
//       <div className="hidden lg:block mt-10">
//         <div className="">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 {[
//                   "Serial Number",
//                   "Description",
//                   "Unit",
//                   "HSN Code",
//                   "Rate",
//                   "Quantity",
//                   "Amount",
//                   "Stock Item",
//                   "Actions",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     scope="col"
//                     className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//               {purchaseData.items.map((item, index) => (
//                 <tr key={item.id} className="text-sm">
//                   <td className="w-24 px-3 py-2 whitespace-nowrap">
//                     {item.serialNumber}
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="text"
//                       value={item.description}
//                       onChange={(e) =>
//                         handleItemChange(index, "description", e.target.value)
//                       }
//                       className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="text"
//                       value={item.unit}
//                       onChange={(e) =>
//                         handleItemChange(index, "unit", e.target.value)
//                       }
//                       className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="text"
//                       value={item.hsnCode}
//                       onChange={(e) =>
//                         handleItemChange(index, "hsnCode", e.target.value)
//                       }
//                       className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="number"
//                       value={item.rate}
//                       onChange={(e) =>
//                         handleItemChange(index, "rate", e.target.value)
//                       }
//                       className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleItemChange(index, "quantity", e.target.value)
//                       }
//                       className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <input
//                       type="number"
//                       value={item.amount}
//                       readOnly
//                       className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
//                     />
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap z-50">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Search..."
//                         value={item.stockGroup || searchTermStock}
//                         onClick={() =>
//                           setIsDropdownOpen((prevState) => ({
//                             ...prevState,
//                             stock: !prevState.stock,
//                           }))
//                         }
//                         onChange={(e) => setSearchTermStock(e.target.value)}
//                         className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                       />
//                       {isDropdownOpen.stock && (
//                         <ul
//                           ref={dropdownRefs.stock}
//                           className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto"
//                         >
//                           {filteredStockData(searchTermStock).map(
//                             (option, optionIndex) => (
//                               <li
//                                 key={optionIndex}
//                                 onClick={() => handleStockSelect(index, option)}
//                                 className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
//                               >
//                                 {option.stockItem}
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-3 py-2 whitespace-nowrap">
//                     <button
//                       onClick={() => deleteItem(index)}
//                       className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* ithu responsive items create */}
//       <div className="lg:hidden mt-10">
//         {purchaseData.items.map((item, index) => (
//           <div
//             key={item.id}
//             className="border-b border-gray-200 dark:border-gray-700 mb-4 p-4"
//           >
//             <div className="font-bold mb-2">Serial Number</div>
//             <div>{item.serialNumber}</div>

//             <div className="font-bold mb-2 mt-4">Description</div>
//             <input
//               type="text"
//               value={item.description}
//               onChange={(e) =>
//                 handleItemChange(index, "description", e.target.value)
//               }
//               className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />

//             <div className="font-bold mb-2 mt-4">Unit</div>
//             <input
//               type="text"
//               value={item.unit}
//               onChange={(e) => handleItemChange(index, "unit", e.target.value)}
//               className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />

//             <div className="font-bold mb-2 mt-4">HSN Code</div>
//             <input
//               type="text"
//               value={item.hsnCode}
//               onChange={(e) =>
//                 handleItemChange(index, "hsnCode", e.target.value)
//               }
//               className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />

//             <div className="font-bold mb-2 mt-4">Rate</div>
//             <input
//               type="number"
//               value={item.rate}
//               onChange={(e) => handleItemChange(index, "rate", e.target.value)}
//               className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />

//             <div className="font-bold mb-2 mt-4">Quantity</div>
//             <input
//               type="number"
//               value={item.quantity}
//               onChange={(e) =>
//                 handleItemChange(index, "quantity", e.target.value)
//               }
//               className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />

//             <div className="font-bold mb-2 mt-4">Amount</div>
//             <input
//               type="number"
//               value={item.amount}
//               readOnly
//               className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
//             />

//             <div className="font-bold mb-2 mt-4 ">Stock Items</div>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={item.stockName || searchTermStock}
//                 onClick={() =>
//                   setIsDropdownOpen((prevState) => ({
//                     ...prevState,
//                     [index]: !prevState[index],
//                   }))
//                 }
//                 onChange={(e) => setSearchTermStock(e.target.value)}
//                 className="w-full px-2 py-1 border rounded cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//               />
//               {isDropdownOpen[index] && (
//                 <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 w-full">
//                   <ul className="max-h-40 overflow-auto">
//                     {filteredStockData(searchTermStock).map((option) => (
//                       <li
//                         key={option._id}
//                         onClick={() => {
//                           handleStockSelect(index, option);
//                           setIsDropdownOpen((prevState) => ({
//                             ...prevState,
//                             [index]: false, // Close dropdown after selection
//                           }));
//                         }}
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {option.stockItem}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className="mt-4 text-right">
//               <button
//                 onClick={() => deleteItem(index)}
//                 className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/*buttons*/}
//       <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-10">
//         <button
//           onClick={addItem}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
//         >
//           Add Item
//         </button>

//         <button
//           onClick={openLedgerModal}
//           className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
//         >
//           Open Ledger Modal
//         </button>
//         {isLedgerModalOpen && <Ledger closeModal={closeLedgerModal} />}

//         <button
//           onClick={openModal}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
//         >
//           Create Company
//         </button>
//         {isModalOpen && (
//           <CreateCompanyModal closeModal={closeModal} themeMode="dark" />
//         )}

//         <button
//           onClick={openModali}
//           className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
//         >
//           Create New Stock Item
//         </button>
//         {isModalOpeni && <CreateStockModal onClose={closeModali} />}
//       </div>

//       {/* tax field  */}
//       <div className="flex flex-wrap gap-4 justify-center mt-10">
//         {/* Tax Rate */}
//         <div className="flex-1 min-w-[200px]">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//             htmlFor="taxRate"
//           >
//             Tax Rate (%)
//           </label>
//           <input
//             type="number"
//             name="taxRate"
//             id="taxRate"
//             value={purchaseData.taxRate || ""}
//             onChange={(e) =>
//               setPurchaseData((prevData) => ({
//                 ...prevData,
//                 taxRate: e.target.value,
//               }))
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>

//         {/* Tax Amount */}
//         <div className="flex-1 min-w-[200px]">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//             htmlFor="taxAmount"
//           >
//             Tax Amount
//           </label>
//           <input
//             type="number"
//             name="taxAmount"
//             id="taxAmount"
//             value={purchaseData.taxAmount || ""}
//             readOnly
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
//           />
//         </div>

//         {/* Subtotal */}
//         <div className="flex-1 min-w-[200px]">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//             htmlFor="subTotal"
//           >
//             Subtotal
//           </label>
//           <input
//             type="number"
//             name="subTotal"
//             id="subTotal"
//             value={purchaseData.subTotal || ""}
//             readOnly
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
//           />
//         </div>

//         {/* Total */}
//         <div className="flex-1 min-w-[200px]">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//             htmlFor="total"
//           >
//             Total
//           </label>
//           <input
//             type="number"
//             name="total"
//             id="total"
//             value={purchaseData.total || ""}
//             readOnly
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
//           />
//         </div>
//       </div>

//       {/* Tax Ledger */}
//       <div className="space-y-4 md:space-y-6 mt-10">
//         <div className="flex flex-wrap gap-4 justify-center">
//           {/* Tax Ledger */}
//           <div className="relative flex-1 min-w-[200px]">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//               htmlFor="taxLedger"
//             >
//               Tax Ledger
//             </label>
//             <input
//               type="text"
//               name="taxLedger"
//               id="taxLedger"
//               value={
//                 purchaseData.debitLedgers[0]?.ledgerName ||
//                 taxDropdownState.searchTerm
//               }
//               onClick={() =>
//                 setTaxDropdownState((prevState) => ({
//                   ...prevState,
//                   isDropdownOpen: !prevState.isDropdownOpen,
//                 }))
//               }
//               onChange={(e) =>
//                 setTaxDropdownState((prevState) => ({
//                   ...prevState,
//                   searchTerm: e.target.value,
//                 }))
//               }
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />
//             {taxDropdownState.isDropdownOpen && (
//               <div
//                 ref={taxDropdownRef}
//                 className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
//               >
//                 <ul className="max-h-40 overflow-auto">
//                   {filteredTaxData(taxDropdownState.searchTerm).map(
//                     (option) => (
//                       <li
//                         key={option._id}
//                         onClick={() => {
//                           handleTaxSelect(option);
//                           setTaxDropdownState((prevState) => ({
//                             ...prevState,
//                             isDropdownOpen: false, // Close dropdown after selection
//                           }));
//                         }}
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {option.name}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Debit Ledger */}
//           <div className="relative flex-1 min-w-[200px]">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//               htmlFor="debitLedger"
//             >
//               Debit Ledger
//             </label>
//             <input
//               type="text"
//               name="debitLedger"
//               id="debitLedger"
//               value={
//                 purchaseData.debitLedgers[1]?.ledgerName || searchTermDebit
//               }
//               onClick={() =>
//                 setIsDropdownOpen((prevState) => ({
//                   ...prevState,
//                   debit: !prevState.debit,
//                 }))
//               }
//               onChange={(e) => setSearchTermDebit(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />
//             {isDropdownOpen.debit && (
//               <div
//                 ref={dropdownRefs.debit}
//                 className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
//               >
//                 <ul className="max-h-40 overflow-auto">
//                   {filteredLedgerData(searchTermDebit).map((option) => (
//                     <li
//                       key={option._id}
//                       onClick={() => {
//                         handleLedgerSelect("debit", option);
//                         setIsDropdownOpen((prevState) => ({
//                           ...prevState,
//                           debit: false,
//                         })); // Close dropdown after selection
//                       }}
//                       className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                     >
//                       {option.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Credit Ledger */}
//           <div className="relative flex-1 min-w-[200px]">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
//               htmlFor="creditLedger"
//             >
//               Credit Ledger
//             </label>
//             <input
//               type="text"
//               name="creditLedger"
//               id="creditLedger"
//               value={purchaseData.creditLedgers[0]?.ledgerName || ""}
//               onClick={() =>
//                 setIsDropdownOpen((prevState) => ({
//                   ...prevState,
//                   credit: !prevState.credit,
//                 }))
//               }
//               onChange={(e) => setSearchTermCredit(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />
//             {isDropdownOpen.credit && (
//               <div
//                 ref={dropdownRefs.credit}
//                 className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
//               >
//                 <ul className="max-h-40 overflow-auto">
//                   {filteredLedgerData(searchTermCredit).map((option) => (
//                     <li
//                       key={option._id}
//                       onClick={() => {
//                         handleLedgerSelect("credit", option);
//                         setIsDropdownOpen((prevState) => ({
//                           ...prevState,
//                           credit: false,
//                         })); // Close dropdown after selection
//                       }}
//                       className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                     >
//                       {option.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="my-10">
//         <button
//           type="button"
//           onClick={handleSaveAndSubmit}
//           className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700"
//           disabled={isLoading}
//         >
//           {isLoading ? "Updating..." : "Update"}
//         </button>
//         <button
//           type="button"
//           onClick={handleDelete}
//           className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700"
//           disabled={isLoading}
//         >
//           {isLoading ? "Deleted..." : "Delete"}
//         </button>
//       </div>

//       {isSuccess && (
//         <p className="text-green-500">Purchase created successfully!</p>
//       )}
//       {isError && (
//         <p className="text-red-500">
//           Failed to create purchase: {error.message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PurchasePreview;
// import React, { useState, useRef, useEffect } from "react";
// import { useGetLedgerQuery } from "../store/api/LedgerApi";
// import { useGetPurchaseByIdQuery } from "../store/api/PurchaseApi";
// import { useParams } from "react-router-dom";

// const PurchaseVoucher = () => {
//   const { transactionId } = useParams();
//   const { data: ledgerData = [], refetch } = useGetLedgerQuery();
//   const [purchaseData, setPurchaseData] = useState({
//     voucherType: "Purchase Voucher",
//     voucherNumber: "",
//     transactionDate: "",
//     debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
//     creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
//   });
//   console.log("purchaseData", purchaseData);
//   const dropdownRefs = {
//     credit: useRef(null),
//   };

//   const { data: paymentVoucher } = useGetPurchaseByIdQuery(
//     transactionId || "",
//     {
//       skip: !transactionId,
//     }
//   );

//   useEffect(() => {
//     if (paymentVoucher) {
//       setPurchaseData({ ...paymentVoucher });
//       // Initialize search terms based on current purchaseData
//       if (paymentVoucher.creditLedgers.length > 0) {
//         setSearchTermCredit(paymentVoucher.creditLedgers[0].ledgerName);
//       }
//     }
//   }, [paymentVoucher]);

//   const [searchTermCredit, setSearchTermCredit] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState({ credit: false });

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const handleLedgerSelect = (type, option) => {
//     setPurchaseData((prevData) => {
//       const updatedCreditLedgers = [...prevData.creditLedgers];
//       const indexToUpdate = 0;

//       updatedCreditLedgers[indexToUpdate] = {
//         ledgerId: option._id,
//         ledgerName: option.name,
//         amount: prevData.total || 0,
//       };

//       return {
//         ...prevData,
//         creditLedgers: updatedCreditLedgers,
//       };
//     });

//     setSearchTermCredit(option.name); // Set selected name to the input
//     setIsDropdownOpen((prevState) => ({ ...prevState, credit: false })); // Close dropdown
//   };

//   const filteredLedgerData = (searchTerm) =>
//     ledgerData.filter((item) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div>
//       {/* Credit Ledger */}
//       <div className="relative flex-1 min-w-[200px]">
//         <label
//           className="block text-gray-700 text-sm font-bold mb-2"
//           htmlFor="creditLedger"
//         >
//           Credit Ledger
//         </label>
//         <input
//           type="text"
//           name="creditLedger"
//           id="creditLedger"
//           value={searchTermCredit}
//           onClick={() =>
//             setIsDropdownOpen((prevState) => ({
//               ...prevState,
//               credit: !prevState.credit,
//             }))
//           }
//           onChange={(e) => setSearchTermCredit(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
//         />
//         {isDropdownOpen.credit && (
//           <div
//             ref={dropdownRefs.credit}
//             className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full"
//           >
//             <ul className="max-h-40 overflow-auto">
//               {filteredLedgerData(searchTermCredit).length > 0 ? (
//                 filteredLedgerData(searchTermCredit).map((option) => (
//                   <li
//                     key={option._id}
//                     onClick={() => handleLedgerSelect("credit", option)}
//                     className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                   >
//                     {option.name}
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-3 py-2 text-gray-500">No data</li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PurchaseVoucher;
import React, { useState, useEffect } from "react";
import { useGetPurchaseByIdQuery } from "../store/api/PurchaseApi";
import { useParams } from "react-router-dom";

const PurchaseVoucher = () => {
  const { transactionId } = useParams();
  const { data: paymentVoucher } = useGetPurchaseByIdQuery(
    transactionId || "",
    {
      skip: !transactionId,
    }
  );

  // State for the purchase data
  const [purchaseData, setPurchaseData] = useState({
    voucherType: "Purchase Voucher",
    voucherNumber: "",
    transactionDate: "",
    creditDueDate: "",
    debitLedgers: [
      { ledgerId: "", ledgerName: "", amount: "" },
      { ledgerId: "", ledgerName: "", amount: "" },
    ],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
  });

  // State for search terms
  const [searchTermCredit, setSearchTermCredit] = useState("");
  const [searchTermDebit, setSearchTermDebit] = useState("");
  const [taxDropdownState, setTaxDropdownState] = useState({
    searchTerm: "",
    isDropdownOpen: false,
  });

  // Effect to load initial values when paymentVoucher is available
  useEffect(() => {
    if (paymentVoucher) {
      setPurchaseData({
        ...paymentVoucher,
        creditDueDate: new Date(paymentVoucher.creditDueDate)
          .toISOString()
          .split("T")[0],
        transactionDate: new Date(paymentVoucher.transactionDate)
          .toISOString()
          .split("T")[0],
      });

      // Set search terms for credit and debit ledgers
      if (paymentVoucher.creditLedgers.length > 0) {
        setSearchTermCredit(paymentVoucher.creditLedgers[0].ledgerName);
      }

      if (paymentVoucher.debitLedgers.length > 0) {
        setSearchTermDebit(paymentVoucher.debitLedgers[1]?.ledgerName || ""); // Second debit ledger
      }

      // Set initial search term for tax if needed
      if (paymentVoucher.debitLedgers.length > 0) {
        setTaxDropdownState((prev) => ({
          ...prev,
          searchTerm: paymentVoucher.debitLedgers[0]?.ledgerName || "",
        }));
      }
    }
  }, [paymentVoucher]);

  return (
    <div>
      {/* Tax Ledger */}
      <div className="relative flex-1 min-w-[200px]">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
          htmlFor="taxLedger"
        >
          Tax Ledger
        </label>
        <input
          type="text"
          name="taxLedger"
          id="taxLedger"
          value={
            taxDropdownState.searchTerm ||
            purchaseData.debitLedgers[0]?.ledgerName ||
            ""
          }
          onChange={(e) =>
            setTaxDropdownState((prevState) => ({
              ...prevState,
              searchTerm: e.target.value,
            }))
          }
          onClick={() =>
            setTaxDropdownState((prevState) => ({
              ...prevState,
              isDropdownOpen: !prevState.isDropdownOpen,
            }))
          }
          className="input-class"
        />
        {/* Add dropdown rendering logic here if needed */}
      </div>

      {/* Debit Ledger */}
      <div className="relative flex-1 min-w-[200px]">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
          htmlFor="debitLedger"
        >
          Debit Ledger
        </label>
        <input
          type="text"
          name="debitLedger"
          id="debitLedger"
          value={
            searchTermDebit || purchaseData.debitLedgers[1]?.ledgerName || ""
          }
          onChange={(e) => setSearchTermDebit(e.target.value)}
          className="input-class"
        />
      </div>

      {/* Credit Ledger */}
      <div className="relative flex-1 min-w-[200px]">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
          htmlFor="creditLedger"
        >
          Credit Ledger
        </label>
        <input
          type="text"
          name="creditLedger"
          id="creditLedger"
          value={
            searchTermCredit || purchaseData.creditLedgers[0]?.ledgerName || ""
          }
          onChange={(e) => setSearchTermCredit(e.target.value)}
          className="input-class"
        />
      </div>
    </div>
  );
};

export default PurchaseVoucher;
