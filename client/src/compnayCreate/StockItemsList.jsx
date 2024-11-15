import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi";
import { useGetStockGroupsQuery } from "../store/api/StockGroupApi";

const StockItemsList = () => {
  const { id } = useParams(); // Get the id from URL
  const navigate = useNavigate();

  // Query hooks for fetching purchases and stock groups
  const {
    data: purchases,
    isLoading: purchasesLoading,
    error: purchasesError,
  } = useGetPurchasesQuery();

  const {
    data: stockGroups,
    isLoading: stockGroupsLoading,
    error: stockGroupsError,
  } = useGetStockGroupsQuery();

  // Loading state
  if (purchasesLoading || stockGroupsLoading) return <p>Loading...</p>;

  // Error handling
  if (purchasesError || stockGroupsError)
    return <p>Error loading data. Please try again later.</p>;

  // Ensure purchases and stockGroups are arrays
  const purchaseItems = Array.isArray(purchases) ? purchases : [];
  const stockGroupsArray = Array.isArray(stockGroups) ? stockGroups : [];

  // Find the selected stock group
  const selectedStockGroup = stockGroupsArray.find((group) => group._id === id);

  if (!selectedStockGroup) return <p>Stock group not found.</p>;

  // Filter purchases based on stock group using the correct property
  const filteredPurchases = purchaseItems.filter(
    (purchase) => purchase.items.some((item) => item.stockGroup === id) // Check stockGroup property
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-md rounded-lg max-w-4xl mx-auto mt-8 border border-gray-300 dark:border-gray-600">
      <h1 className="text-2xl font-bold mb-6">
        Purchase Details for Stock Group: {selectedStockGroup.name}
      </h1>
      {filteredPurchases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((purchase) => (
            <div
              key={purchase._id}
              className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-300 dark:border-gray-600"
              onClick={() => navigate(`/admin/purchase/${purchase._id}`)} // Navigate to specific purchase details
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {purchase.voucherNumber} - {purchase.voucherType}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date:{" "}
                  {new Date(purchase.transactionDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Description: {purchase.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Amount: ${purchase.total}
                </p>
              </div>
              <div className="flex flex-col mt-4">
                <h3 className="text-md font-semibold">Items:</h3>
                {purchase.items
                  .filter((item) => item.stockGroup === id) // Filter items by stock group
                  .map((item) => (
                    <div
                      key={item._id}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 mb-2"
                    >
                      <p className="text-sm font-semibold">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Rate: ${item.rate}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Amount: ${item.amount}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <div className="animate-bounce text-center mb-4">
            <p className="text-xl font-bold text-red-500">
              No purchases found for this stock group!
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
