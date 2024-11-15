import React from "react";
import { Outlet } from "react-router-dom";

import ReportTrackerHeader from "./ReportTrackerHeader ";
function ReportTrackerOutlet() {
  return (
    <>
      <ReportTrackerHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}
export default ReportTrackerOutlet;
