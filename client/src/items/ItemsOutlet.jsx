import { Outlet } from "react-router-dom";

import ItemsHeader from "./ItemsHeader";

function ItemsOutelet() {
  return (
    <>
      <ItemsHeader />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default ItemsOutelet;
