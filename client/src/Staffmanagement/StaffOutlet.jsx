import { Outlet } from "react-router-dom";

import StaffHeader from "./StaffHeader";

function StaffOutlet() {
  return (
    <>
      <StaffHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default StaffOutlet;
