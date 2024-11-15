import { NavLink } from "react-router-dom";

function InvoiceHeader() {
  return (
    <div className="sticky top-0 bg-blue-300 dark:bg-black dark:text-white text-black  hidden xl:block  p-2 z-30">
      <div className="flex  justify-between md:justify-end space-x-6 font-bold">
        <NavLink
          to="/transactions/expensecreate"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          expensecreate
        </NavLink>
        <NavLink
          to="/transactions/expensechart"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          chartview
        </NavLink>

        <NavLink
          to="/transactions/expensetable"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          expensetable
        </NavLink>
      </div>
    </div>
  );
}

export default InvoiceHeader;
