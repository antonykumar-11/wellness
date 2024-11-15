// import React, { useRef } from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import InvoicePDF from "./InvoicePdf"; // Import your InvoicePDF component
// import { useNavigate } from "react-router-dom";
// import { useDeleteInvoiceMutation } from "../store/api/InvoicesApi"; // Adjust the path as needed
// import convertNumberToWords from "./convertNumberToWords";
// import Image from "../assets/logo.png";
// const Invoice = ({ data }) => {
//   const componentRef = useRef();
//   const subtotal = data.items.reduce(
//     (acc, item) => acc + Number(item.price) * item.qty,
//     0
//   );
//   const cgst = subtotal * 0.09;
//   const sgst = subtotal * 0.09;
//   const total = subtotal + cgst + sgst;
//   const navigate = useNavigate();
//   const [deleteInvoice] = useDeleteInvoiceMutation(); // RTK Query hook for deleting invoice

//   const handleEdit = () => {
//     navigate(`/invoice/invoice/edit/${data._id}`); // Navigate to the edit page
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteInvoice(data._id).unwrap(); // Delete invoice and wait for completion
//       navigate("/invoice/invoice-preview"); // Redirect after successful delete
//     } catch (error) {
//       console.error("Failed to delete invoice: ", error);
//       // Optionally handle the error, e.g., show a message to the user
//     }
//   };

//   return (
//     <div className="p-4">
//       <div
//         ref={componentRef}
//         className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg"
//       >
//         {/* Invoice Header */}
//         <div
//           className="relative flex items-center justify-center mb-4"
//           style={{ position: "relative" }}
//         >
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-800 uppercase">
//               {data.companyName}
//             </h1>
//             <p className="text-lg text-gray-600">{data.companyTagline}</p>
//           </div>
//           <img
//             src={Image}
//             alt="Company Logo"
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 w-64 h-64 rounded-full object-contain"
//             style={{ marginRight: "-4rem" }}
//           />
//         </div>

//         {/* Company and Invoice Details */}
//         <div className="text-right mb-6">
//           <p className="text-base text-gray-600">{data.companyAddress.line1}</p>
//           <p className="text-base text-gray-600">{data.companyAddress.line2}</p>
//           <p className="text-base text-gray-600">{data.companyAddress.line3}</p>
//           <p className="text-base text-gray-600">{data.companyAddress.line4}</p>
//           <p className="text-base text-gray-600">{data.companyAddress.line5}</p>
//         </div>

//         <h2 className="text-center mb-8 text-2xl font-semibold">Tax Invoice</h2>

//         <div className="flex justify-between mb-8">
//           <div>
//             <p className="text-base text-gray-600">PAN NO: {data.panNo}</p>
//             <p className="text-base text-gray-600">GST NO: {data.gstNo}</p>
//           </div>
//           <div>
//             <p className="text-base text-gray-600">
//               INVOICE NO: {data.invoiceNo}
//             </p>
//             <p className="text-base text-gray-600">DATE: {data.date}</p>
//           </div>
//         </div>

//         {/* Billed and Shipped To Addresses */}
//         <div className="mb-8">
//           <div className="flex justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-600">
//                 Billed To:
//               </h2>
//               <div className="text-base text-gray-600">
//                 <p>{data.billedTo.line1}</p>
//                 <p>{data.billedTo.line2}</p>
//                 <p>{data.billedTo.line3}</p>
//                 <p>{data.billedTo.line4}</p>
//                 <p>{data.billedTo.line5}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <h2 className="text-lg font-semibold text-gray-600">
//                 Shipped To:
//               </h2>
//               <div className="text-base text-gray-600">
//                 <p>{data.shippedTo.line1}</p>
//                 <p>{data.shippedTo.line2}</p>
//                 <p>{data.shippedTo.line3}</p>
//                 <p>{data.shippedTo.line4}</p>
//                 <p>{data.shippedTo.line5}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Invoice Items */}
//         <div className="mb-8">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2 text-left text-sm">Sl No.</th>
//                 <th className="border px-4 py-2 text-left text-sm">
//                   Description
//                 </th>
//                 <th className="border px-4 py-2 text-left text-sm">HSN Code</th>
//                 <th className="border px-4 py-2 text-left text-sm">Unit</th>
//                 <th className="border px-4 py-2 text-left text-sm">Qty</th>
//                 <th className="border px-4 py-2 text-left text-sm">
//                   Rate Price
//                 </th>
//                 <th className="border px-4 py-2 text-left text-sm">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2 text-left text-sm">
//                     {item.SerialNumber}
//                   </td>
//                   <td className="border px-4 py-2 text-left text-sm">
//                     {item.description}
//                   </td>
//                   <td className="border px-4 py-2 text-left text-sm">
//                     {item.hsnCode}
//                   </td>
//                   <td className="border px-4 py-2 text-left text-sm">
//                     {item.unit}
//                   </td>
//                   <td className="border px-4 py-2 text-center text-sm">
//                     {item.qty}
//                   </td>
//                   <td className="border px-4 py-2 text-right text-sm">
//                     {Number(item.price).toFixed(2)}
//                   </td>
//                   <td className="border px-4 py-2 text-right text-sm">
//                     {(Number(item.price) * item.qty).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Total and Amount in Words */}
//         <div className="flex justify-end mb-8">
//           <div className="text-right">
//             <p className="text-base text-gray-600">
//               Subtotal: ₹{subtotal.toFixed(2)}
//             </p>
//             <p className="text-base text-gray-600">
//               Add CGST @9%: ₹{cgst.toFixed(2)}
//             </p>
//             <p className="text-base text-gray-600">
//               Add SGST @9%: ₹{sgst.toFixed(2)}
//             </p>
//             <p className="text-2xl font-bold text-gray-800">
//               Total: ₹{total.toFixed(2)}
//             </p>
//           </div>
//         </div>
//         <div className="mb-8">
//           <p className="text-base text-gray-600">
//             Amount in Words: {convertNumberToWords(total)}
//           </p>
//         </div>

//         {/* Bank Details and Declaration */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold text-gray-600 mb-2">
//             Bank Details:
//           </h2>
//           <p className="text-base text-gray-600">{data.bankDetails.name}</p>
//           <p className="text-base text-gray-600">
//             Account Number: {data.bankDetails.accountNumber}
//           </p>
//           <p className="text-base text-gray-600">
//             IFSC Code: {data.bankDetails.ifsc}
//           </p>
//           <p className="text-base text-gray-600">
//             Branch: {data.bankDetails.branch}
//           </p>
//         </div>
//         <div className="mb-8">
//           <p className="text-base text-gray-600 text-[16px]">
//             {data.declaration}
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-base text-gray-600 mb-2">For {data.companyName}</p>
//           <p className="text-base text-gray-600">Authorized Signatory</p>
//         </div>
//       </div>

//       {/* PDF Download Button */}
//       <div className="flex justify-center mt-8">
//         <PDFDownloadLink
//           document={<InvoicePDF data={data} />}
//           fileName="invoice.pdf"
//         >
//           {({ loading }) =>
//             loading ? (
//               <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
//                 Loading document...
//               </button>
//             ) : (
//               <button className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
//                 Download PDF
//               </button>
//             )
//           }
//         </PDFDownloadLink>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-between mt-8">
//         <button
//           onClick={handleEdit}
//           className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
//         >
//           Edit
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Invoice;
import React, { useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePdf"; // Import your InvoicePDF component
import { useNavigate } from "react-router-dom";
import { useDeleteInvoiceMutation } from "../store/api/InvoicesApi"; // Adjust the path as needed
import convertNumberToWords from "./convertNumberToWords";
import Image from "../assets/logo.png";

const Invoice = ({ data }) => {
  const componentRef = useRef();
  const subtotal = data.items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;
  const navigate = useNavigate();
  const [deleteInvoice] = useDeleteInvoiceMutation(); // RTK Query hook for deleting invoice

  const handleEdit = () => {
    navigate(`/invoice/invoice/edit/${data._id}`); // Navigate to the edit page
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(data._id).unwrap(); // Delete invoice and wait for completion
      navigate("/invoice/invoice-preview"); // Redirect after successful delete
    } catch (error) {
      console.error("Failed to delete invoice: ", error);
      // Optionally handle the error, e.g., show a message to the user
    }
  };

  return (
    <div className="p-6">
      <div
        ref={componentRef}
        className="max-w-4xl mx-auto bg-white p-10 shadow-md rounded-lg"
      >
        {/* Invoice Header */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 uppercase">
              {data.companyName}
            </h1>
            <p className="text-lg text-gray-600">{data.companyTagline}</p>
          </div>
          <img
            src={Image}
            alt="Company Logo"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-32 rounded-full object-contain"
            style={{ marginRight: "-4rem" }}
          />
        </div>

        {/* Company and Invoice Details */}
        <div className="text-right mb-10">
          <p className="text-base text-gray-600">{data.companyAddress.line1}</p>
          <p className="text-base text-gray-600">{data.companyAddress.line2}</p>
          <p className="text-base text-gray-600">{data.companyAddress.line3}</p>
          <p className="text-base text-gray-600">{data.companyAddress.line4}</p>
          <p className="text-base text-gray-600">{data.companyAddress.line5}</p>
        </div>

        <h2 className="text-center mb-8 text-2xl font-semibold">Tax Invoice</h2>

        <div className="flex justify-between mb-10">
          <div>
            <p className="text-base text-gray-600">PAN NO: {data.panNo}</p>
            <p className="text-base text-gray-600">GST NO: {data.gstNo}</p>
          </div>
          <div>
            <p className="text-base text-gray-600">
              INVOICE NO: {data.invoiceNo}
            </p>
            <p className="text-base text-gray-600">DATE: {data.date}</p>
          </div>
        </div>

        {/* Billed and Shipped To Addresses */}
        <div className="mb-10">
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Billed To:
              </h2>
              <div className="text-base text-gray-600">
                <p>{data.billedTo.line1}</p>
                <p>{data.billedTo.line2}</p>
                <p>{data.billedTo.line3}</p>
                <p>{data.billedTo.line4}</p>
                <p>{data.billedTo.line5}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-600">
                Shipped To:
              </h2>
              <div className="text-base text-gray-600">
                <p>{data.shippedTo.line1}</p>
                <p>{data.shippedTo.line2}</p>
                <p>{data.shippedTo.line3}</p>
                <p>{data.shippedTo.line4}</p>
                <p>{data.shippedTo.line5}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-10">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Sl No.
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  HSN Code
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Unit
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Qty
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Rate Price
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.SerialNumber}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.description}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.hsnCode}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.unit}
                  </td>
                  <td className="border px-4 py-2 text-center text-sm">
                    {item.qty}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    {Number(item.price).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    {(Number(item.price) * item.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total and Amount in Words */}
        <div className="flex justify-end mb-10">
          <div className="text-right">
            <p className="text-base text-gray-600 mb-1">
              Subtotal: ₹{subtotal.toFixed(2)}
            </p>
            <p className="text-base text-gray-600 mb-1">
              Add CGST @9%: ₹{cgst.toFixed(2)}
            </p>
            <p className="text-base text-gray-600 mb-1">
              Add SGST @9%: ₹{sgst.toFixed(2)}
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              Total: ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mb-10">
          <p className="text-base text-gray-600">
            Amount in Words: {convertNumberToWords(total)}
          </p>
        </div>

        {/* Bank Details and Declaration */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            Bank Details:
          </h2>
          <p className="text-base text-gray-600">{data.bankDetails.name}</p>
          <p className="text-base text-gray-600">
            Account Number: {data.bankDetails.accountNumber}
          </p>
          <p className="text-base text-gray-600">
            IFSC Code: {data.bankDetails.ifsc}
          </p>
          <p className="text-base text-gray-600">
            Branch: {data.bankDetails.branch}
          </p>
        </div>
        <div className="mb-10">
          <p className="text-base text-gray-600 text-[16px]">
            {data.declaration}
          </p>
        </div>
        <div className="mb-10 text-right">
          <p className="text-lg font-semibold text-gray-600">
            For {data.companyName}
          </p>
          <p className="text-base text-gray-600">{data.director}</p>
          <p className="text-base text-gray-600">Managing Director</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700"
        >
          Edit
        </button>
        <PDFDownloadLink
          document={<InvoicePDF data={data} />}
          fileName="invoice.pdf"
          className="bg-green-600 text-white px-6 py-2 rounded shadow-md hover:bg-green-700"
        >
          {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
        </PDFDownloadLink>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded shadow-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Invoice;
