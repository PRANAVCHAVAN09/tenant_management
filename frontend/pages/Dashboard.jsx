import { useEffect, useState } from "react";
import { getStats } from "../services/dashboardService";

const Dashboard = () => {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStats();
      setStats(data);
    };
    fetchData();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Active Users</h2>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Roles</h2>
          <p className="text-3xl font-bold">{stats.totalRoles}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Sites</h2>
          <p className="text-3xl font-bold">{stats.totalSites}</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
