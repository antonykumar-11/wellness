import { Outlet } from "react-router-dom";

import StockHeader from "./StockHeader";

function StockOutlet() {
  return (
    <>
      <StockHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default StockOutlet;
