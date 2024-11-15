import { Outlet } from "react-router-dom";

// import SalePrevieweOutlets from "./SalePrevieweHeader";

function SalePrevieweOutlet() {
  return (
    <>
      {/* <SalePrevieweOutlets /> */}

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default SalePrevieweOutlet;
