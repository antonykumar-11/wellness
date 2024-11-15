import { NavLink } from "react-router-dom";

function InvoiceHeader() {
  return (
    <div className="sticky top-0 bg-blue-300 dark:bg-black dark:text-white text-black  hidden xl:block  p-2 z-30">
      <div className="flex  justify-between md:justify-end space-x-4 font-bold">
        <NavLink
          to="/staff"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Staff Overview
        </NavLink>

        <NavLink
          to="/staff/attendence"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          attendence
        </NavLink>

        <NavLink
          to="/staff/payHeadDetails"
          // to="/staff/salaryslip"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Staff create
        </NavLink>

        <NavLink
          to="/staff/payhaddetails"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Pay Head Details
        </NavLink>
        <NavLink
          to="/staff/paymaster"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          paymaster
        </NavLink>
        <NavLink
          to="/staff/paymasterpriview"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          paymasterpriview
        </NavLink>

        <NavLink
          to="/staff/settings"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          setting
        </NavLink>
      </div>
    </div>
  );
}

export default InvoiceHeader;
