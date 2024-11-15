import { Outlet } from "react-router-dom";

import BalanceSheetrOutletHeader from "./InvoiceHeaders";

function BalanceSheetrOutlett() {
  return (
    <>
      <BalanceSheetrOutletHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default BalanceSheetrOutlett;
