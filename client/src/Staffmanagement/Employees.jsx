// import React, { useState, useEffect } from "react";
// import { useCreatePayHeadDetailsMutation } from "../store/api/payHeadDetailsApi";
// import { useGetLedgerQuery } from "../store/api/LedgerPayHead";
// import { FaPlus, FaTrash, FaSave, FaUndo } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import Loader from "../auth/Loader";
// const EmployeeSalarySlipEdit = () => {
//   const { employeeId } = useParams();

//   const {
//     data: payHeads = [],
//     isLoading: payHeadsLoading,
//     isError: payHeadsError,
//   } = useGetLedgerQuery();

//   const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();

//   const [date, setDate] = useState("");
//   const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [manualTotalHours, setManualTotalHours] = useState("");

//   const handlePayHeadChange = (index, event) => {
//     const selectedId = event.target.value;
//     const payHead = payHeads.find((head) => head._id === selectedId);

//     if (payHead) {
//       const computedOn =
//         payHead.operations
//           ?.map((op) => `${op.operands.join(", ")} ${op.operator}`)
//           .join(" ") || "";

//       const updatedPayHeadDetailsList = [...payHeadDetailsList];
//       updatedPayHeadDetailsList[index] = {
//         ...updatedPayHeadDetailsList[index],
//         payHead,
//         displayNameInPayslip: payHead.displayNameInPayslip || "",
//         rate: payHead.rate || "",
//         totalDays: 0,
//         payHeadType: payHead.payHeadType,
//         calculationType: payHead.calculationType,
//         computedOn,
//         operations: payHead.operations || [],
//         group: payHead.group || "", // Add group
//         nature: payHead.nature || "", // Add nature
//         under: payHead.under || "", // Add under
//       };
//       setPayHeadDetailsList(updatedPayHeadDetailsList);
//     }
//   };

//   const handleDetailChange = (index, field, value) => {
//     const updatedPayHeadDetailsList = [...payHeadDetailsList];
//     updatedPayHeadDetailsList[index][field] = value;
//     setPayHeadDetailsList(updatedPayHeadDetailsList);
//   };

//   const handleSave = async () => {
//     try {
//       const newPayHeadDetails = {
//         date,
//         details: payHeadDetailsList.map((detail) => ({
//           payHeadId: detail.payHead?._id,
//           displayNameInPayslip: detail.displayNameInPayslip,
//           payHeadName: detail.displayNameInPayslip,
//           rate: detail.rate,
//           totalDays: detail.totalDays,
//           payHeadType: detail.payHeadType,
//           calculationType: detail.calculationType,
//           computedOn: detail.computedOn,
//           totalHoursPerDay: manualTotalHours || 0,
//           group: detail.group, // Add group
//           nature: detail.nature, // Add nature
//           under: detail.under, // Add under
//         })),
//       };

//       const response = await createPayHeadDetails({
//         ...newPayHeadDetails,
//         employeeId,
//       }).unwrap();
//       console.log("Save response:", response);
//       setLoading(true); // Start loading
//       setPayHeadDetailsList([]);
//       setDate("");

//       alert("Pay head details saved successfully!");

//       setLoading(false); // End loading
//     } catch (error) {
//       console.error("Save error:", error);
//       alert("Failed to save pay head details.");
//     }
//   };

//   const addNewPayHeadDetail = () => {
//     setPayHeadDetailsList([
//       ...payHeadDetailsList,
//       {
//         payHead: null,
//         displayNameInPayslip: "",
//         rate: "",
//         totalDays: 0,
//         payHeadType: "",
//         calculationType: "",
//         computedOn: "",
//         operations: [],
//       },
//     ]);
//   };
//   const deletePayHeadDetail = (index) => {
//     const updatedPayHeadDetailsList = payHeadDetailsList.filter(
//       (_, i) => i !== index
//     );
//     setPayHeadDetailsList(updatedPayHeadDetailsList);
//   };
//   if (loading) {
//     return <Loader />;
//   }
//   return (
//     <div className="p-4 max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
//       <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
//         Salary Slip
//       </h2>
//       <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
//         <div className="flex-1 mb-4 lg:mb-0">
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Date
//           </label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//           />
//         </div>
//         <div className="flex-1 mb-4 lg:mb-0">
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Total Hours Per Day
//           </label>
//           <input
//             type="number"
//             value={manualTotalHours}
//             onChange={(e) => setManualTotalHours(e.target.value)}
//             className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//             placeholder="hour in day"
//           />
//         </div>
//       </div>

//       <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
//         <thead>
//           <tr>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Pay Head
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Rate
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Total Days
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Pay Head Type
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Calculation Type
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Computed On
//             </th>
//             <th className="border-b border-gray-300 dark:border-gray-600">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {payHeadDetailsList.map((detail, index) => (
//             <tr key={index}>
//               <td>
//                 <select
//                   onChange={(e) => handlePayHeadChange(index, e)}
//                   value={detail.payHead?._id || ""}
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 >
//                   <option value="">Select Pay Head</option>
//                   {payHeadsLoading && <option>Loading...</option>}
//                   {payHeadsError && <option>Error loading pay heads</option>}
//                   {payHeads.map((head) => (
//                     <option key={head._id} value={head._id}>
//                       {head.displayNameInPayslip}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.rate}
//                   onChange={(e) =>
//                     handleDetailChange(index, "rate", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="number"
//                   value={detail.totalDays}
//                   onChange={(e) =>
//                     handleDetailChange(index, "totalDays", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.payHeadType}
//                   onChange={(e) =>
//                     handleDetailChange(index, "payHeadType", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.calculationType}
//                   onChange={(e) =>
//                     handleDetailChange(index, "calculationType", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.computedOn}
//                   onChange={(e) =>
//                     handleDetailChange(index, "computedOn", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.group}
//                   onChange={(e) =>
//                     handleDetailChange(index, "group", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.nature}
//                   onChange={(e) =>
//                     handleDetailChange(index, "nature", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={detail.under}
//                   onChange={(e) =>
//                     handleDetailChange(index, "under", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </td>
//               <td>
//                 <button
//                   onClick={() => deletePayHeadDetail(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex space-x-2 mt-4">
//         <button
//           onClick={addNewPayHeadDetail}
//           className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
//         >
//           <FaPlus className="mr-2" />
//           Add Pay Head
//         </button>

//         <button
//           onClick={handleSave}
//           className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
//         >
//           <FaSave className="mr-2" />
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeSalarySlipEdit;

import React, { useState, useEffect } from "react";
import { useCreatePayHeadDetailsMutation } from "../store/api/payHeadDetailsApi";
import { useGetLedgerQuery } from "../store/api/LedgerPayHead";
import { FaPlus, FaTrash, FaSave, FaUndo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loader from "../auth/Loader";
const EmployeeSalarySlipEdit = () => {
  const { employeeId } = useParams();

  const {
    data: payHeads = [],
    isLoading: payHeadsLoading,
    isError: payHeadsError,
    refetch,
  } = useGetLedgerQuery();

  const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();
  useEffect(() => {
    refetch();
  }, [refetch]);
  const [date, setDate] = useState("");
  const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualTotalHours, setManualTotalHours] = useState("");
  const [manualTotalDays, setManualTotalDays] = useState("");
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  const handlePayHeadChange = (index, event) => {
    const selectedId = event.target.value;
    const payHead = payHeads.find((head) => head._id === selectedId);

    if (payHead) {
      const computedOn =
        payHead.operations
          ?.map((op) => `${op.operands.join(", ")} ${op.operator}`)
          .join(" ") || "";

      const updatedPayHeadDetailsList = [...payHeadDetailsList];
      updatedPayHeadDetailsList[index] = {
        ...updatedPayHeadDetailsList[index],
        payHead,
        displayNameInPayslip: payHead.displayNameInPayslip || "",
        rate: payHead.rate || "",
        totalDays: 0,
        payHeadType: payHead.payHeadType,
        calculationType: payHead.calculationType,
        computedOn,
        operations: payHead.operations || [],
        group: payHead.group || "", // Add group
        nature: payHead.nature || "", // Add nature
        under: payHead.under || "", // Add under
      };
      setPayHeadDetailsList(updatedPayHeadDetailsList);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedPayHeadDetailsList = [...payHeadDetailsList];
    updatedPayHeadDetailsList[index][field] = value;
    setPayHeadDetailsList(updatedPayHeadDetailsList);
  };
  const handleSave = async () => {
    try {
      const newPayHeadDetails = {
        date,
        details: payHeadDetailsList.map((detail) => ({
          payHeadId: detail.payHead?._id,
          displayNameInPayslip: detail.displayNameInPayslip,
          payHeadName: detail.displayNameInPayslip,
          rate: detail.rate,
          totalDays: detail.totalDays,
          payHeadType: detail.payHeadType,
          calculationType: detail.calculationType,
          computedOn: detail.computedOn,
          totalHoursPerDay: manualTotalHours || 0,
          totalDaysPerMonth: manualTotalDays || 0,
          group: detail.group,
          nature: detail.nature,
          under: detail.under,
        })),
      };

      const response = await createPayHeadDetails({
        employeeId, // Pass employeeId separately
        newPayHeadDetails, // Pass newPayHeadDetails as an object
      }).unwrap();

      console.log("Save response:", response);
      setLoading(true); // Start loading
      setPayHeadDetailsList([]);
      setDate("");

      alert("Pay head details saved successfully!");

      setLoading(false); // End loading
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save pay head details.");
    }
  };

  const addNewPayHeadDetail = () => {
    setPayHeadDetailsList([
      ...payHeadDetailsList,
      {
        payHead: null,
        displayNameInPayslip: "",
        rate: "",
        totalDays: 0,
        payHeadType: "",
        calculationType: "",
        computedOn: "",
        operations: [],
      },
    ]);
  };
  const deletePayHeadDetail = (index) => {
    const updatedPayHeadDetailsList = payHeadDetailsList.filter(
      (_, i) => i !== index
    );
    setPayHeadDetailsList(updatedPayHeadDetailsList);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4 max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
      <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
        Salary Slip
      </h2>
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
        <div className="flex-1 mb-4 lg:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex-1 mb-4 lg:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Total Hours Per Day
          </label>
          <input
            type="number"
            value={manualTotalHours}
            onChange={(e) => setManualTotalHours(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="hour in day"
          />
        </div>
        <div className="flex-1 mb-4 lg:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Total Days in Month
          </label>
          <input
            type="number"
            value={manualTotalDays}
            onChange={(e) => setManualTotalDays(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="hour in day"
          />
        </div>
      </div>

      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Pay Head
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Rate
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Total Days
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Pay Head Type
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Calculation Type
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Computed On
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {payHeadDetailsList.map((detail, index) => (
            <tr key={index}>
              <td>
                <select
                  onChange={(e) => handlePayHeadChange(index, e)}
                  value={detail.payHead?._id || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Pay Head</option>
                  {payHeadsLoading && <option>Loading...</option>}
                  {payHeadsError && <option>Error loading pay heads</option>}
                  {payHeads.map((head) => (
                    <option key={head._id} value={head._id}>
                      {head.displayNameInPayslip}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={detail.rate}
                  onChange={(e) =>
                    handleDetailChange(index, "rate", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={detail.totalDays}
                  onChange={(e) =>
                    handleDetailChange(index, "totalDays", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.payHeadType}
                  onChange={(e) =>
                    handleDetailChange(index, "payHeadType", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.calculationType}
                  onChange={(e) =>
                    handleDetailChange(index, "calculationType", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.computedOn}
                  onChange={(e) =>
                    handleDetailChange(index, "computedOn", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>

              <td>
                <button
                  onClick={() => deletePayHeadDetail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={addNewPayHeadDetail}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Pay Head
        </button>

        <button
          onClick={handleSave}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaSave className="mr-2" />
          Save
        </button>
        <div
          onClick={openModalAsk} // On button click, open the modal
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
        >
          Any Help
        </div>
      </div>
      {askHelp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
          <div className="bg-white lg:mr-24 rounded-lg p-6 md:p-8 max-w-lg md:max-w-6xl mx-auto relative shadow-lg border border-blue-300">
            <button
              onClick={closeModalAsk} // Close modal when "Thank You" is clicked
              className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
            >
              Thank You
            </button>
            <h2 className="text-xl font-bold text-center mb-4 text-blue-600 tracking-wide">
              Information Guide
            </h2>
            <div className="overflow-y-auto max-h-[70vh]">
              {" "}
              {/* Limit height for scrolling */}
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">1 :</span>
                ഇവിടെ നമ്മൾ ഒരു ഡ്രൈവറിന്റെ ശമ്പളമാണ് കൊടുക്കാൻ പോകുന്നെങ്കിൽ ആ
                മാസത്തിലെ ഒരു തിയതി കൊടുക്കണം അതിനു ശേഷം Add Pay Select ചെയ്തു
                അയാളുടെ ആ മാസം നമ്മൾ എത്ര ശമ്പളം കൊടുക്കാൻ തീരുമാനിച്ചു ( Basic
                pay ) എന്നുള്ള Pay Head തിരഞ്ഞെടുക്കണം എന്നിട്ടു എത്ര രുപയാണ്
                മുതലാളി ആ മാസം ആ ജോലിക്കാരന് കൊടുക്കാൻ പോകുന്നതെന്ന് (50000)
                Rate ന്റെ കീഴിൽ എഴുതണം അതിനു ശേഷം ഈ ശമ്പളം മുഴുവൻ ആ ജോലിക്കാരന്
                കിട്ടണമെങ്കിൽ അയാൾ ആ മാസം എത്ര ദിവസം ജോലി ചെയ്യണമെന്ന് (26)
                Total Days ന്റെ കീഴിൽ എഴുതി കൊടുക്കണം
              </p>
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">2 :</span>
                ഇവിടെ നമ്മൾ ഒരു വാഹനം വാടകയ്ക്കു തന്ന ആളിന്റെ ശമ്പളമാണ്
                കൊടുക്കാൻ പോകുന്നെങ്കിൽ ആ മാസത്തിലെ ഒരു തിയതി കൊടുക്കണം. അതിനു
                ശേഷം ഒരു ദിവസത്തിൽ എത്ര മണിക്കൂർ ഉണ്ടെന്നു ഇവിടെ Total Hours Per
                Day എന്ന ഭാഗത്തു എഴുതണം അതിനു ശേഷം ആ മാസത്തിൽ എത്ര ദിവസം ആ വാഹനം
                ഓടിയിരിക്കണം എന്ന് Total Days in Month ന്റെ ഭാഗത്തു എഴുതി
                കൊടുക്കണം . എന്നിട്ടു Add Pay Select ചെയ്തു അയാളുടെ ആ മാസം നമ്മൾ
                എത്ര ശമ്പളം കൊടുക്കാൻ തീരുമാനിച്ചു ( Basic Rent ) എന്നുള്ള Pay
                Head തിരഞ്ഞെടുക്കണം എന്നിട്ടു എത്ര രുപയാണ് മുതലാളി ആ മാസം ആ
                വാഹനത്തിനു കൊടുക്കാൻ പോകുന്നതെന്ന് (50000) Rate ന്റെ കീഴിൽ
                എഴുതണം
              </p>
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">3 :</span>നമ്മൾ നമ്മുടെ വാഹന
                ഉടമയ്ക്കും ,ഡ്രൈവറിനും ശമ്പളം തീരുമാനിക്കുമ്പോൾ അയാൾ
                എന്തെങ്കിലും അഡ്വാൻസ് വാങ്ങിയിട്ടുണ്ടെങ്കിൽ Pay Head ന്റെ
                ഭാഗത്തു Advance select ചെയുകയും Rate ന്റെ ഭാഗത്തു എത്ര രൂപാ
                വാങ്ങിയോ അത് എഴുതുകയും വേണം
              </p>
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">4:</span>
                നമ്മൾ നമ്മുടെ വാഹന ഉടമയ്ക്കും ,ഡ്രൈവറിനും ശമ്പളം
                തീരുമാനിക്കുമ്പോൾ അയാളുടെ ശമ്പളത്തിൽ നിന്നും എന്തെങ്കിലും
                computer പരമായി കുറയ്ക്കണം എങ്കിൽ Pay Head ന്റെ ഭാഗത്തു
                കുറയ്ക്കാൻ നമ്മൾ എഴുതിയ name ഉദാഹരണത്തിന് (TDX) കൊടുക്കുകയും
                Rate ന്റെ ഭാഗത്തു എത്ര രൂപാ കുറയ്ക്കണമോ അത് എഴുതുകയും വേണം
              </p>
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">4:</span>
                നമ്മൾ നമ്മുടെ ഡ്രൈവറിനും ശമ്പളം തീരുമാനിക്കുമ്പോൾ അയാളുടെ
                ശമ്പളത്തിന്റെ കൂടെ എന്തെങ്കിലും Over time കൊടുക്കണമെങ്കിൽ എങ്കിൽ
                Pay Head ന്റെ ഭാഗത്തു (Over Time ) Rate ന്റെ ഭാഗത്തു എത്ര രൂപാ
                ആണ് ഒരു മണിക്കൂറിൽ കൊടുക്കാൻ തീരുമാനിച്ചു എന്നുള്ളതും എഴുതുകയും
                വേണം
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalarySlipEdit;
