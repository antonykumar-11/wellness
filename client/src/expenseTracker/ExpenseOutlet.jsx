import { Outlet } from "react-router-dom";

import ExpenseHeader from "./ExpenseHeader";

function StaffOutlet() {
  return (
    <>
      <ExpenseHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default StaffOutlet;
