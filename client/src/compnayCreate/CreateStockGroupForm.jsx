import React, { useState } from "react";
import { useCreateStockCategoryMutation } from "../store/api/StockCategoryApi";
import { useGetStockGroupsQuery } from "../store/api/StockGroupApi";

const CreateForm = () => {
  const [formData, setFormData] = useState({
    stockGroup: "",
    stockCategory: "",
  });
  console.log("formData", formData);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetStockGroupsQuery();

  const [createStockCategory] = useCreateStockCategoryMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create Stock Category
      await createStockCategory({
        name: formData.stockGroup, // Name of the stock group
        stockGroup: formData.stockCategory, // ID of the selected stock category
      }).unwrap();

      alert("Stock group and ledger created successfully!");
      // Reset form fields after submission
      setFormData({
        stockGroup: "",
        stockCategory: "",
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formClassName =
    "p-6 rounded-lg shadow-lg max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputClassName =
    "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 focus:ring-indigo-500";
  const buttonClassName = "px-4 py-2 font-semibold rounded-md shadow-md";
  const cancelButtonClassName = "bg-gray-500 text-white hover:bg-gray-600";
  const submitButtonClassName = "bg-blue-500 text-white hover:bg-blue-600";

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (categoriesError)
    return <p>Error loading categories: {categoriesError.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className={formClassName}>
        <h2 className="text-2xl font-bold mb-4">Create Stock Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stockGroup" className={labelClassName}>
              Stock Group
            </label>
            <input
              type="text"
              id="stockGroup"
              name="stockGroup"
              value={formData.stockGroup}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="stockCategoryId" className={labelClassName}>
              Stock Category
            </label>
            <select
              id="stockCategory"
              name="stockCategory"
              value={formData.stockCategory}
              onChange={handleChange}
              className={inputClassName}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  stockGroup: "",
                  stockCategoryId: "",
                })
              }
              className={`${buttonClassName} ${cancelButtonClassName}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonClassName} ${submitButtonClassName}`}
            >
              Create Stock Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
