import { NavLink } from "react-router-dom";

function InvoiceHeader() {
  return (
    <div className="sticky top-0 bg-blue-300 dark:bg-black dark:text-white text-black  hidden xl:block  p-2 z-30">
      <div className="flex  justify-between md:justify-end space-x-6 font-bold">
        <NavLink
          to="/invoice/customerManagement"
          className="px-3 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          customerManagements
        </NavLink>
        <NavLink
          to="/invoice/GetCustomer"
          className="px-3 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          GetCustomer
        </NavLink>
      </div>
    </div>
  );
}

export default InvoiceHeader;
