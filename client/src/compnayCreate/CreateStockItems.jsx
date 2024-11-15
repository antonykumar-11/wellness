import React, { useState } from "react";
import { useCreateStockItemMutation } from "../store/api/StockItemsApi";
import { useGetStockCategoriesQuery } from "../store/api/StockCategoryApi";

const unitOptions = [
  { name: "Pieces", symbol: "pcs" },
  { name: "Kilograms", symbol: "kg" },
  { name: "Liters", symbol: "ltr" },
  { name: "Meters", symbol: "mtr" },
  { name: "Dozen", symbol: "doz" },
  { name: "Boxes", symbol: "box" },
  { name: "Sets", symbol: "set" },
  { name: "Pairs", symbol: "pair" },
  { name: "Crates", symbol: "crate" },
  { name: "Packs", symbol: "pack" },
];

const CreateStockItems = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      serialNumber: "1",
      stockName: "",
      description: "",
      quantity: "",
      price: "",
      amount: 0,
      unit: "",
      hsnCode: "",
      taxRate: "",
      taxAmount: 0,
      stockGroup: "",
      stockGroupName: "",
      subtotal: 0,
      total: 0,
    },
  ]);
  console.log(items);
  const { data: stockGroups, isLoading: loadingStockGroups } =
    useGetStockCategoriesQuery();
  console.log("stock", stockGroups);
  const [createStockItem, { isLoading, error }] = useCreateStockItemMutation();

  // Handle changes for each field
  const handleChange = (index, e) => {
    const { name, value } = e.target;

    setItems((prev) => {
      const updatedItems = [...prev];
      updatedItems[index] = { ...updatedItems[index], [name]: value };

      // Calculate amount and taxAmount based on price, quantity, and taxRate
      if (name === "quantity" || name === "price" || name === "taxRate") {
        const quantity = Number(updatedItems[index].quantity);
        const price = Number(updatedItems[index].price);
        const taxRate = Number(updatedItems[index].taxRate);

        // Calculate total amount and tax amount
        const totalAmount = quantity * price;
        const calculatedTaxAmount = (totalAmount * taxRate) / 100;

        updatedItems[index].amount = totalAmount;
        updatedItems[index].taxAmount = calculatedTaxAmount.toFixed(2);
      }

      // Update stockGroupName based on selected stockGroup
      if (name === "stockGroup") {
        const selectedGroup = stockGroups.find((group) => group._id === value);
        updatedItems[index].stockGroupName = selectedGroup
          ? selectedGroup.name // Corrected this line to access the 'name' property
          : ""; // Set to empty string if not found
      }

      return updatedItems;
    });
  };

  // Add new item row
  const handleAddItem = () => {
    setItems((prevItems) => {
      const newId = prevItems.length + 1;
      return [
        ...prevItems,
        {
          id: newId,
          serialNumber: newId.toString(),
          StockName: "",
          description: "",
          quantity: "",
          price: "",
          amount: 0,
          unit: "",
          hsnCode: "",
          taxRate: "",
          taxAmount: 0,
          stockGroup: "",
          stockGroupName: "",
          subtotal: 0,
          total: 0,
        },
      ];
    });
  };

  // Remove item row
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const item of items) {
        // Ensure the required fields are populated, excluding stockItemId
        await createStockItem({
          ...item,
          amount: item.amount || 0,
          taxAmount: item.taxAmount || 0,
          stockGroupName: item.stockGroupName || "",
          // Do not include stockItemId here
        }).unwrap();
      }

      alert("Stock item(s) created successfully!");
      // Reset items after successful creation
      setItems([
        /* initial state */
      ]);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const containerClassName = "container mx-auto p-4";
  const formClassName =
    "p-6 rounded-lg shadow-lg max-w-full mx-auto bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputClassName =
    "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 focus:ring-indigo-500";
  const buttonClassName = "px-4 py-2 font-semibold rounded-md shadow-md";
  const submitButtonClassName = "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <div className={containerClassName}>
      <div className={formClassName}>
        <h2 className="text-2xl font-bold mb-4">Create Stock Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor={`stockName-${index}`}
                  className={labelClassName}
                >
                  Stock Name
                </label>
                <input
                  type="text"
                  id={`stockName-${index}`}
                  name="stockName"
                  value={item.stockName}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`description-${index}`}
                  className={labelClassName}
                >
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  rows="3"
                  required
                />
              </div>
              <div>
                <label htmlFor={`quantity-${index}`} className={labelClassName}>
                  Quantity
                </label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor={`price-${index}`} className={labelClassName}>
                  Price
                </label>
                <input
                  type="number"
                  id={`price-${index}`}
                  name="price"
                  value={item.price}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor={`amount-${index}`} className={labelClassName}>
                  Total Amount
                </label>
                <input
                  type="number"
                  id={`amount-${index}`}
                  name="amount"
                  value={item.amount}
                  className={inputClassName}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor={`unit-${index}`} className={labelClassName}>
                  Unit
                </label>
                <select
                  id={`unit-${index}`}
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                >
                  <option value="">Select a unit</option>
                  {unitOptions.map((option) => (
                    <option key={option.symbol} value={option.symbol}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`hsnCode-${index}`} className={labelClassName}>
                  HSN Code
                </label>
                <input
                  type="text"
                  id={`hsnCode-${index}`}
                  name="hsnCode"
                  value={item.hsnCode}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor={`taxRate-${index}`} className={labelClassName}>
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id={`taxRate-${index}`}
                  name="taxRate"
                  value={item.taxRate}
                  onChange={(e) => handleChange(index, e)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`taxAmount-${index}`}
                  className={labelClassName}
                >
                  Tax Amount
                </label>
                <input
                  type="number"
                  id={`taxAmount-${index}`}
                  name="taxAmount"
                  value={item.taxAmount}
                  className={inputClassName}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor={`stockGroup-${index}`}
                  className={labelClassName}
                >
                  Stock Group
                </label>
                <select
                  id={`stockGroup-${index}`}
                  name="stockGroup"
                  value={item.stockGroup}
                  onChange={(e) => handleChange(index, e)} // Just call handleChange
                  className={inputClassName}
                  required
                  disabled={loadingStockGroups}
                >
                  <option value="">Select a stock group</option>
                  {stockGroups?.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className={`${buttonClassName} bg-red-500 text-white hover:bg-red-600 mt-4`}
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className={`${buttonClassName} bg-green-500 text-white hover:bg-green-600 mt-4`}
          >
            Add Item
          </button>
          <button
            type="submit"
            className={`${buttonClassName} ${submitButtonClassName} mt-4`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Stock Item(s)"}
          </button>
          {error && <p className="text-red-600">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateStockItems;
