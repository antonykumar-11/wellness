import { Outlet } from "react-router-dom";

import InvoiceOutlet from "./InvoiceHeaders";

function VoucherOutlet() {
  return (
    <>
      <InvoiceOutlet />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default VoucherOutlet;
