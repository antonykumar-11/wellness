import { NavLink } from "react-router-dom";

function ExpenseHeader() {
  return (
    <div className="sticky top-0 bg-gray-800 text-white p-4 shadow-md z-30 ">
      <div className="flex flex-wrap justify-end gap-4">
        <NavLink
          to="/manu"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          Staffs
        </NavLink>

        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          expenseexpense
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 e rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          incomemain
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1  rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          hai
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 no-underline no-no-underline rounded "
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          Salary create
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1  rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          Pay Head Details
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1  rounded no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          ledgeretails
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 no-underline rounded ooono-no-underline"
              : "px-3 py-1 no-underline rounded hover:bg-blue-700"
          }
        >
          allledgerview
        </NavLink>
      </div>
    </div>
  );
}

export default ExpenseHeader;
