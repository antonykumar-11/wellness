import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetStockItemByIdQuery } from "../store/api/StockItemsApi";

const StockItemsList = () => {
  const { itemId } = useParams(); // Get the categoryId from URL

  const navigate = useNavigate();

  // Fetch stock items by category ID
  const {
    data: stockItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useGetStockItemByIdQuery(itemId);
  console.log("stockItems", stockItems);
  // Loading state
  if (itemsLoading) return <p>Loading stock items...</p>;

  // Error handling
  if (itemsError)
    return (
      <p>
        Error loading stock items. Please check your network or try again later.
      </p>
    );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-md rounded-lg max-w-4xl mx-auto mt-8 border border-gray-300 dark:border-gray-600">
      <h1 className="text-2xl font-bold mb-6">Stock Items</h1>
      {stockItems?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-300 dark:border-gray-600"
              onClick={() => navigate(`/admin/stock/item/${item._id}`)} // Navigate to specific stock item details
            >
              <figure className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.image || "placeholder.jpg"} // Default image if not available
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full border border-gray-600 dark:border-gray-400"
                />
              </figure>
              <div className="flex flex-col">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stock No: {item.stockNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Price: ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <div className="animate-bounce text-center mb-4">
            <p className="text-xl font-bold text-red-500">
              No stock items found!
            </p>
          </div>
          <img
            src="no-data-image.jpg"
            alt="No data"
            className="w-32 h-32 object-cover rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default StockItemsList;
