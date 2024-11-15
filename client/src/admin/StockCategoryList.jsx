import React from "react";
import { Link } from "react-router-dom";
import { useGetStockCategoriesQuery } from "../store/api/StockCategoryApi";

const StockCategoryList = () => {
  const { data: categories, error, isLoading } = useGetStockCategoriesQuery();

  // Log categories for debugging
  console.log("categories", categories);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!categories || categories.length === 0)
    return <p>No categories available.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category._id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <div>
              <p className="text-lg font-semibold">{category.name}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              to={`/stock/createstockgroupform/${category._id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockCategoryList;
