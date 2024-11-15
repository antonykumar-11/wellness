import { NavLink } from "react-router-dom";

function StockHeader() {
  return (
    <div className="sticky top-0 bg-blue-300 dark:bg-black dark:text-white text-black  hidden xl:block  p-2 z-30">
      <div className="flex  justify-between md:justify-end space-x-6 font-bold">
        <NavLink
          to="/stock/iddetails"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Stock category
        </NavLink>
        <NavLink
          to="/stock/createstockgroupform"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Stock group
        </NavLink>

        <NavLink
          to="/stock/createstockitems"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Create Stock
        </NavLink>
        <NavLink
          to="/stock/stockcategorylist"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Show Stock Cetegory
        </NavLink>
        <NavLink
          to="/stock/stockview"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          View Stock
        </NavLink>
        <NavLink
          to="/stock/ledgerCreate"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          Create Ledger
        </NavLink>
        <NavLink
          to="/stock/ledgerlist"
          className="px-1 py-1 no-underline rounded hover:text-white hover:bg-black dark:hover:bg-gradient-to-r from-green-400 to-blue-500"
        >
          View Ledger
        </NavLink>
      </div>
    </div>
  );
}

export default StockHeader;
