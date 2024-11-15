import { Outlet } from "react-router-dom";

import ExpenceTrackerOutlet from "./ExpenseHeadertracker";

function ExpenceTrackerOutletOutlet() {
  return (
    <>
      <ExpenceTrackerOutlet />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default ExpenceTrackerOutletOutlet;
