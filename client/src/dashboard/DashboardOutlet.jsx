import { Outlet } from "react-router-dom";

import DashboardHeader from "./DashboardHeader";

function DashOutlet() {
  return (
    <>
      <DashboardHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default DashOutlet;
