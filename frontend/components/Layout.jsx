import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async() => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Tenant Panel</h1>

        <Link to="/dashboard" className="mb-3 hover:text-blue-400">Dashboard</Link>
        <Link to="/users" className="mb-3 hover:text-blue-400">Users</Link>
        <Link to="/roles" className="mb-3 hover:text-blue-400">Roles</Link>
        <Link to="/sites" className="mb-3 hover:text-blue-400">Sites</Link>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">

        {/* Header */}
        <div className="h-14 bg-white shadow flex items-center px-6 font-semibold">
          Tenant Management System
        </div>

        {/* Page Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Layout;
