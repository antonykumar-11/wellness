import { NavLink } from "react-router-dom";

function InvoiceHeader() {
  return (
    <div className="sticky top-0 bg-gray-800 text-white p-4 shadow-md z-30 ">
      <div className="flex flex-wrap justify-end gap-4">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          PurchaseForm
        </NavLink>

        <NavLink
          to="/vouchers/purchasedetails"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          purchasedetails
        </NavLink>

        <NavLink
          to="/vouchers/paymentform"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          paymentform
        </NavLink>
        <NavLink
          to="/vouchers/sales"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 no-underline rounded "
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          sales
        </NavLink>
        <NavLink
          to="/vouchers/receipt"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          Receipt
        </NavLink>

        <NavLink
          to="/vouchers/journal"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          journal
        </NavLink>

        <NavLink
          to="/vouchers/contravoucher"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          contra voucher
        </NavLink>
        <NavLink
          to="/vouchers/creditnote"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          creditnote
        </NavLink>
        <NavLink
          to="/vouchers/debitnote"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          debitnote
        </NavLink>
      </div>
    </div>
  );
}

export default InvoiceHeader;
