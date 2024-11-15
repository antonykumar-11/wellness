import { Outlet } from "react-router-dom";
import Sidebar from "../home/Sidebar";
import Header from "../home/Header";

const MainOutlet = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainOutlet;
