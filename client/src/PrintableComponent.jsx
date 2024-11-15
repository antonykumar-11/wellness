import React, { useRef } from "react";
import User from "./User";

const UserPrint = () => {
  const printRef = useRef();

  // Hardcoded user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">User Information</h1>

      <div ref={printRef} className="mb-4">
        <User user={user} />
      </div>

      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Print User
      </button>
    </div>
  );
};

export default UserPrint;
