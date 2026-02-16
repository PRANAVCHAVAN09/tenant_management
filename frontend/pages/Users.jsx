import { useEffect, useState } from "react";
import { getUsers, createUser, deactivateUser } from "../services/userService";
import { getRoles } from "../services/roleService";
import { getSites } from "../services/siteService";
import { toast } from "react-toastify";



const Users = () => {

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [site, setSite] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Load dropdown data
  const loadMeta = async () => {
    const rolesData = await getRoles();
    const sitesData = await getSites();
    setRoles(rolesData);
    setSites(sitesData);
  };

  // Load users
  const loadUsers = async () => {
    const data = await getUsers(page, search);
    setUsers(data.users);
    setPages(data.pages);
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();

    await createUser({ name, email, role, site });

    setName("");
    setEmail("");
    setRole("");
    setSite("");

    loadUsers();
  };

  // Deactivate
  const handleDeactivate = async (id) => {
    try {
      await deactivateUser(id);

      // refresh list
      loadUsers();

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Create User Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-4 gap-4">

        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          {roles.map(r => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          required
        >
          <option value="">Select Site</option>
          {sites.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <button className="bg-blue-500 text-white py-2 rounded col-span-4">
          Create User
        </button>

      </form>

      {/* Search */}
      <input
        className="border p-2 mb-4 w-1/3"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {/* User Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Site</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users?.map(user => (
              <tr key={user._id} className="border-t text-center">

                <td className="p-2">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role?.name}
                  {user.role?.status === "inactive" && (
                    <span className="ml-2 text-xs text-red-500">(Role Inactive)</span>
                  )}
                </td>
                <td>{user.site?.name}</td>
                <td>
                  <span className={user.status === "active" ? "text-green-600" : "text-red-500"}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {/* {user.status === "active" && (
                    <button
                      onClick={() => handleDeactivate(user._id)}
                      className="text-red-500"
                    >
                      Deactivate
                    </button>
                  )} */}
                  <button
                    onClick={() => {
                      if (user.status === "inactive" && user.role?.status === "inactive") {
                        toast.error("Cannot activate user. Role is inactive.");
                        return;
                      }
                      handleDeactivate(user._id);
                    }}
                    className={`px-3 py-1 rounded text-white ${user.status === "active"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {[...Array(pages)]?.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default Users;
