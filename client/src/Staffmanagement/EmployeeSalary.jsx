import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PayPage = () => {
  const { employeeId } = useParams(); // Get employeeId from URL parameters
  console.log("employeeId", employeeId);
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    if (choice === "employee") {
      navigate(`/staff/employees/${employeeId}`);
    } else if (choice === "driver") {
      navigate(`/staff/driver/${employeeId}`);
    }
  };
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          For whom do you want to define salary?
        </h1>
      </div>
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => handleChoice("employee")}
          className="w-full bg-blue-500 text-white p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create Salary
        </button>
        <button
          onClick={() => handleChoice("driver")}
          className="w-full bg-green-500 text-white p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Update Salary Details
        </button>
        <button
          onClick={openModalAsk} // On button click, open the modal
          className="w-full bg-yellow-500 text-white p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Any Help
        </button>
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
                <span className="font-semibold">Create Salary :</span>
                ഇവിടെ Create Salary കൊണ്ട് ഉദ്ദേശിക്കുന്നത് ഒരു ജോലിക്കാരന്
                ആദ്യം ഇവിടെ ആണ് സാലറി ഓരോ മാസത്തേയും തീരുമാനിക്കേണ്ടത് .
              </p>
              <p className="text-sm mb-4 leading-relaxed tracking-wide">
                <span className="font-semibold">Update Salary Details :</span>
                ഇവിടെ Update Salary Details കൊണ്ട് ഉദ്ദേശിക്കുന്നത് ഒരു
                ജോലിക്കാരന് നേരത്തെ എന്തെങ്കിലും സാലറി കൊടുത്തിട്ടുണ്ടെങ്കിൽ ആ
                വിവരങ്ങൾ കാണാനും അതിൽ എന്തെങ്കിലും മാറ്റം വരുത്തണമെങ്കിലും ഇതിൽ
                click ചെയ്ത മതി .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPage;
