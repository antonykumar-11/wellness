import { NavLink } from "react-router-dom";

function ExpenseHeader() {
  return (
    <div className="sticky top-0 bg-gray-800 text-white p-4 shadow-md z-30 ">
      <div className="flex flex-wrap justify-end gap-4">
        <NavLink
          to="/expense/incomemain"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 bg-blue-600 rounded underline"
              : "px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          }
        >
          incomemain
        </NavLink>
      </div>
    </div>
  );
}

export default ExpenseHeader;
