import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Tenant Panel</h1>

        <Link to="/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/users" className="block hover:text-blue-400">Users</Link>
        <Link to="/roles" className="block hover:text-blue-400">Roles</Link>
        <Link to="/sites" className="block hover:text-blue-400">Sites</Link>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;
