import React, { useState } from "react";

const CalculatorModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");

  const handleButtonClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleCalculate = () => {
    try {
      // Evaluate the expression
      const result = eval(input);
      setInput(result.toString());
    } catch (error) {
      setInput("Error");
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleAllClear = () => {
    setInput(""); // Reset input
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1)); // Remove last character
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handlePercentage = () => {
    try {
      const result = eval(input) / 100;
      setInput(result.toString());
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl mb-4 text-center">Calculator</h2>
            <div className="bg-gray-200 p-4 text-right text-2xl mb-4 h-16 overflow-hidden rounded flex items-center justify-between">
              <span>{input || "0"}</span>
              {input && (
                <button onClick={handleCopy} className="text-blue-500 ml-2">
                  Copy
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["7", "8", "9", "/"].map((value) => (
                <button
                  key={value}
                  onClick={() => handleButtonClick(value)}
                  className="bg-blue-500 text-white p-4 rounded"
                >
                  {value}
                </button>
              ))}
              {["4", "5", "6", "*"].map((value) => (
                <button
                  key={value}
                  onClick={() => handleButtonClick(value)}
                  className="bg-blue-500 text-white p-4 rounded"
                >
                  {value}
                </button>
              ))}
              {["1", "2", "3", "-"].map((value) => (
                <button
                  key={value}
                  onClick={() => handleButtonClick(value)}
                  className="bg-blue-500 text-white p-4 rounded"
                >
                  {value}
                </button>
              ))}
              {["0", ".", "%"].map((value) => (
                <button
                  key={value}
                  onClick={() => handleButtonClick(value)}
                  className="bg-blue-500 text-white p-4 rounded"
                >
                  {value}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="bg-yellow-500 text-white p-4 rounded"
              >
                ⬅️
              </button>
              <button
                onClick={handleAllClear}
                className="bg-red-500 text-white p-4 rounded"
              >
                AC
              </button>
              <button
                onClick={handleCalculate}
                className="bg-green-500 text-white p-4 rounded"
              >
                =
              </button>
              <button
                onClick={() => handleButtonClick("+")}
                className="bg-blue-500 text-white p-4 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CalculatorModal;
