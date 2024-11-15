import { NavLink } from "react-router-dom";

function ExpenseHeader() {
  return (
    <div className="sticky top-0 bg-blue-300 dark:bg-black dark:text-white text-black  hidden xl:block  p-2 z-30">
      <div className="flex  justify-between md:justify-end space-x-6 font-bold">
        <NavLink
          to="/admin/balancesheet"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Balance Sheet
        </NavLink>

        <NavLink
          to="/admin/profitandloss"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Profit And Loss
        </NavLink>

        <NavLink
          to="/admin/createcompany"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Create Customers
        </NavLink>

        <NavLink
          to="/admin/companydetails"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Customer Details
        </NavLink>

        <NavLink
          to="/admin/monthprofit"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Month Profit Create
        </NavLink>

        <NavLink
          to="/admin/monthprofittable"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Month Profit
        </NavLink>
        <NavLink
          to="/admin/vehicleRentCreate"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          VehicleRentCreate
        </NavLink>
        <NavLink
          to="/admin/mvehicleRentTable"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          mvehicleRentTable
        </NavLink>
      </div>
    </div>
  );
}

export default ExpenseHeader;
