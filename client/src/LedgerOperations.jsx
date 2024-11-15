// // LedgerOperations.js
// import { useState } from "react";

// import { useGetLedgerQuery } from "./store/api/LedgerPayHead";
// function LedgerOperations({ onClose, onSave }) {
//   const { data: ledgers = [] } = useGetLedgerQuery(); // Fetch ledgers
//   const [selectedItem, setSelectedItem] = useState("");
//   const [operator, setOperator] = useState("");
//   const [operations, setOperations] = useState([]);

//   const handleAddOperation = () => {
//     setOperations([...operations, { operator, operands: selectedItem }]);
//     setSelectedItem("");
//     setOperator("");
//   };

//   const handleSave = () => {
//     onSave(operations);
//     onClose();
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col">
//         <label htmlFor="item" className="mb-1 font-semibold">
//           Select Item
//         </label>
//         <select
//           id="item"
//           value={selectedItem}
//           onChange={(e) => setSelectedItem(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="">Select Item</option>
//           {ledgers.map((ledger) => (
//             <option key={ledger.id} value={ledger.id}>
//               {ledger.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="operator" className="mb-1 font-semibold">
//           Operator
//         </label>
//         <select
//           id="operator"
//           value={operator}
//           onChange={(e) => setOperator(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="">Select Operator</option>
//           <option value="+">+</option>
//           <option value="-">-</option>
//           <option value="*">*</option>
//           <option value="/">/</option>
//         </select>
//       </div>

//       <button
//         type="button"
//         onClick={handleAddOperation}
//         className="w-full p-2 bg-blue-500 text-white rounded mt-4"
//       >
//         Add Operation
//       </button>

//       <div>
//         <h2 className="text-lg font-bold mt-4">Operations</h2>
//         <ul className="list-disc pl-6">
//           {operations.map((op, index) => (
//             <li key={index}>
//               {op.item} - {op.operator}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         type="button"
//         onClick={handleSave}
//         className="w-full p-2 bg-green-500 text-white rounded mt-4"
//       >
//         Save Operations
//       </button>
//     </div>
//   );
// }

// export default LedgerOperations;
// LedgerOperations.js
import { useState } from "react";
import { useGetLedgerQuery } from "./store/api/LedgerPayHead";

function LedgerOperations({ onClose, onSave }) {
  const { data: ledgers = [] } = useGetLedgerQuery(); // Fetch ledgers
  const [selectedItem, setSelectedItem] = useState("");
  const [operator, setOperator] = useState("");
  const [operations, setOperations] = useState([]);

  const handleAddOperation = () => {
    setOperations([...operations, { operator, operands: selectedItem }]);
    setSelectedItem("");
    setOperator("");
  };

  const handleSave = () => {
    onSave(operations);
    onClose();
  };

  return (
    <div className="space-y-4 p-4 rounded bg-white shadow-lg dark:bg-gray-800 dark:border dark:border-gray-600">
      <div className="flex flex-col">
        <label
          htmlFor="item"
          className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
        >
          Select Item
        </label>
        <select
          id="item"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="p-2 border rounded bg-white text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        >
          <option value="" className="dark:bg-gray-700 dark:text-gray-300">
            Select Item
          </option>
          {ledgers.map((ledger) => (
            <option
              key={ledger.id}
              value={ledger.id}
              className="dark:bg-gray-700 dark:text-gray-300"
            >
              {ledger.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="operator"
          className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
        >
          Operator
        </label>
        <select
          id="operator"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="p-2 border rounded bg-white text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        >
          <option value="" className="dark:bg-gray-700 dark:text-gray-300">
            Select Operator
          </option>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleAddOperation}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 mt-4"
      >
        Add Operation
      </button>

      <div>
        <h2 className="text-lg font-bold mt-4 text-gray-800 dark:text-gray-200">
          Operations
        </h2>
        <ul className="list-disc pl-6">
          {operations.map((op, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {op.operands} - {op.operator}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 mt-4"
      >
        Save Operations
      </button>
    </div>
  );
}

export default LedgerOperations;
