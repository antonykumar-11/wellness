import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import PurchaseSearch from "./PurchaseSearch";
import PurchaseSearch2 from "./PursacheSearch2";
import StockLedger from "./StockLedger";
import TaxRateSelector from "./TaxRateSelector";
import Ledger from "../vouchers/payment/Ledger";

// Separate reusable components for table and card view
const ItemTable = ({
  items,
  handleDeleteItem,
  handleInputChange,
  handleItemChange,
  handleChangee,
}) => (
  <table className="min-w-full border-collapse border border-gray-300 hidden md:table">
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
            <StockLedger
              stocks={item.stocks}
              value={item.ledger}
              onChange={(option) => handleChangee(option, item.id)}
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <input
              type="text"
              name="hsnCode"
              value={item.hsnCode}
              onChange={(e) =>
                handleInputChange(item.id, e.target.name, e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <input
              type="text"
              name="unit"
              value={item.unit}
              onChange={(e) =>
                handleInputChange(item.id, e.target.name, e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(item.id, { quantity: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <input
              type="number"
              name="rate"
              value={item.rate}
              onChange={(e) =>
                handleItemChange(item.id, { rate: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
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
);

const ItemCard = ({
  item,
  handleDeleteItem,
  handleInputChange,
  handleItemChange,
  handleChangee,
}) => (
  <div className="border border-gray-300 mb-4 rounded-lg p-4">
    <div className="flex justify-between mb-2">
      <span className="font-semibold">Sl No:</span>
      <span>{item.serialNumber}</span>
    </div>
    <div className="mb-2">
      <span className="font-semibold">Ledger:</span>
      <StockLedger
        stocks={item.stocks}
        value={item.ledger}
        onChange={(option) => handleChangee(option, item.id)}
        className="mt-1"
      />
    </div>
    <div className="mb-2">
      <span className="font-semibold">HSN Code:</span>
      <input
        type="text"
        name="hsnCode"
        value={item.hsnCode}
        onChange={(e) =>
          handleInputChange(item.id, e.target.name, e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
      />
    </div>
    <div className="mb-2">
      <span className="font-semibold">Unit:</span>
      <input
        type="text"
        name="unit"
        value={item.unit}
        onChange={(e) =>
          handleInputChange(item.id, e.target.name, e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
      />
    </div>
    <div className="mb-2">
      <span className="font-semibold">Quantity:</span>
      <input
        type="number"
        name="quantity"
        value={item.quantity}
        onChange={(e) =>
          handleItemChange(item.id, { quantity: e.target.value })
        }
        className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
      />
    </div>
    <div className="mb-2">
      <span className="font-semibold">Rate:</span>
      <input
        type="number"
        name="rate"
        value={item.rate}
        onChange={(e) => handleItemChange(item.id, { rate: e.target.value })}
        className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
      />
    </div>
    <div className="flex justify-between mb-2">
      <span className="font-semibold">Amount:</span>
      <span>{item.amount}</span>
    </div>
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => handleDeleteItem(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        <BiTrash />
      </button>
    </div>
  </div>
);

const PurchaseAccount = ({
  handleSelect,
  handleDeleteItem,
  allState,
  handleChange,
  filteredLedgers,
  handleInputChange,
  handleItemChange,
  items1,
  handleChangee,
  selectedLedger,
  stocks,
  allLedgers,
  purchaseData,
  setPurchaseData,
  stockLedger,
  hello,
  hello2,
  selectedLedger2,
  taxes,
  taxId,
  buttonLedger,
  hello3,
}) => {
  const [showDropdown, setShowDropdown] = useState({});
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = (itemId) => {
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLedgerSelect = (ledger, itemId) => {
    handleSelect(ledger, itemId, ledger.name);
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 bg-slate-200 shadow-md rounded-lg p-4">
      <div className="mb-4 bg-pink-400 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <PurchaseSearch
              value={value}
              hello={hello}
              selectedLedger={selectedLedger}
              onChange={(e) => setValue(e)}
              options={allLedgers}
            />
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <PurchaseSearch2
              hello2={hello2}
              options={allLedgers}
              buttonledger={buttonLedger}
            />
          </div>
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <button
              onClick={openModal}
              className="w-full bg-blue-500 text-white rounded py-2"
            >
              Create Ledger
            </button>
            {isModalOpen && <Ledger closeModal={closeModal} />}
          </div>
        </div>
      </div>

      {/* Table view for larger screens */}
      <ItemTable
        items={items1}
        handleDeleteItem={handleDeleteItem}
        handleInputChange={handleInputChange}
        handleItemChange={handleItemChange}
        handleChangee={handleChangee}
      />

      {/* Card view for smaller screens */}
      <div className="block md:hidden">
        {items1.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            handleDeleteItem={handleDeleteItem}
            handleInputChange={handleInputChange}
            handleItemChange={handleItemChange}
            handleChangee={handleChangee}
          />
        ))}
      </div>

      <div className="w-full mt-4 flex flex-col lg:flex-row lg:space-x-4">
        <div className="relative w-full lg:w-auto flex flex-col lg:flex-row px-4 items-center">
          <div className="flex text-start lg:items-center bg-gray-200 h-full rounded-l-md px-2">
            <span className="text-gray-700 text-start">Tax Rate (%)</span>
          </div>
          <input
            type="number"
            id="taxRate"
            name="taxRate"
            value={allState.taxRate}
            onChange={handleChange}
            className="block w-full lg:w-auto pl-4 pr-4 py-2 bg-white border-l-0 border border-gray-300 rounded-r-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter tax rate"
          />
        </div>
        <TaxRateSelector
          hello3={hello3}
          options={allLedgers}
          className="px-4 w-full"
        />
      </div>

      <div className="flex justify-between mt-4 mb-28">
        <div className="flex flex-col justify-center pl-0 lg:pl-8 mt-6 lg:mt-0">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h5 className="text-lg font-medium">Subtotal:</h5>
            <h5 className="text-lg font-medium">₹{allState.subTotal}</h5>
          </div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h5 className="text-lg font-medium">Tax:</h5>
            <h5 className="text-lg font-medium">₹{allState.taxAmount}</h5>
          </div>
          <div className="flex justify-between items-center">
            <h5 className="text-lg font-medium">Total:</h5>
            <h5 className="text-lg font-medium">₹{allState.total}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAccount;
