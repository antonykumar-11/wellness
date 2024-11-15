import Sidebar from "../home/Sidebar";
import Header from "../home/Header";
import { Outlet } from "react-router-dom";

const Layout = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-base-100 text-base-content dark:bg-gray-900 dark:text-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <Header toggleSidebar={toggleSidebar} className="" />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
