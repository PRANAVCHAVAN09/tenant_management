import { useEffect, useState } from "react";
import { getRoles, createRole, deleteRole } from "../services/roleService";

const Roles = () => {

  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = async () => {
    await createRole({ name, permissions: [] });
    setName("");
    fetchRoles();
  };

  const handleDelete = async (id) => {
    await deleteRole(id);
    fetchRoles();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2">
          Add Role
        </button>
      </div>

      {roles.map(role => (
        <div key={role._id} className="bg-white p-3 mb-2 shadow flex justify-between">
          <span>{role.name}</span>
          <button
            onClick={() => handleDelete(role._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Roles;
