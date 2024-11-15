import { Outlet } from "react-router-dom";

import DashboardHeader from "./AdminDashBoardHeader";

function AdminDashBoardOutlet() {
  return (
    <>
      <DashboardHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default AdminDashBoardOutlet;
