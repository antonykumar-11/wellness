import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetStockGroupsQuery } from "../store/api/StockGroupApi";

const StockGroupList = () => {
  const navigate = useNavigate();

  // Fetch stock groups
  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useGetStockGroupsQuery();

  // Loading state
  if (groupsLoading) return <p>Loading stock groups...</p>;

  // Error handling
  if (groupsError)
    return <p>Error loading stock groups. Please try again later.</p>;

  // Render stock groups
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-md rounded-lg max-w-4xl mx-auto mt-8 border border-gray-300 dark:border-gray-600">
      <h1 className="text-2xl font-bold mb-6">Stock Groups</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group) => (
          <div
            key={group._id}
            className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-300 dark:border-gray-600"
            onClick={() => navigate(`/stock/group/${group._id}`)}
          >
            <div className="flex flex-col">
              <p className="font-semibold text-lg">{group.name}</p>{" "}
              {/* Adjusted from stockGroup to name */}
              {group.stockCategory && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {group.stockCategory.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockGroupList;
