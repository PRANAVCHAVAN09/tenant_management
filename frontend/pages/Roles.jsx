import { useEffect, useState } from "react";
import { getRoles, createRole, deleteRole, updateRole, getPermissions } from "../services/roleService";
import { toast } from "react-toastify";




const Roles = () => {

  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsMaster, setPermissionsMaster] = useState([]);
  const [status, setStatus] = useState("active");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  const fetchPermissions = async () => {
    const data = await getPermissions();
    setPermissionsMaster(data);
  };
  const startEditingPermissions = (role) => {
    setEditingRoleId(role._id);
    setEditingPermissions(role.permissions || []);
    setShowDropdown(false);
  };


const addPermission = async (role, permission) => {

  try {

    const updatedPermissions = [...role.permissions, permission];

    await updateRole(role._id, { permissions: updatedPermissions });

    toast.success("Permission added");

    setShowDropdown(false);
    fetchRoles();

  } catch (err) {
    toast.error("Failed to add permission");
  }
};



  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const togglePermission = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleCreate = async () => {
    if (!name) {
      toast.warning("Role name is required");
      return;
    }

    try {
      await createRole({
        name,
        permissions: selectedPermissions,
        status
      });

      toast.success("Role created successfully");

      setName("");
      setSelectedPermissions([]);
      setStatus("active");

      fetchRoles();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Role is assigned to users. Cannot delete."
      );
    }
  };

  // Activate / Deactivate role
  const toggleStatus = async (role) => {
    try {
      const newStatus = role.status === "active" ? "inactive" : "active";
      await updateRole(role._id, { ...role, status: newStatus });

      toast.info(`Role ${newStatus}`);
      fetchRoles();

    } catch (err) {
      toast.error("Unable to update role");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles & Permissions</h1>

      {/* CREATE ROLE */}
      <div className="bg-white p-4 shadow mb-6">

        <input
          className="border p-2 mb-4 w-full"
          placeholder="Role name (e.g. Manager)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* STATUS SELECT */}
        <div className="mb-4">
          <label className="font-semibold mr-3">Status:</label>
          <select
            className="border p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <h3 className="font-semibold mb-2">Permissions</h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {permissionsMaster.map(permission => (
            <label key={permission} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission)}
                onChange={() => togglePermission(permission)}
              />
              <span className="text-sm">{permission}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Role
        </button>
      </div>



      {/* ROLE LIST */}
      {roles.map(role => {

        const remainingPermissions = permissionsMaster.filter(
          p => !role.permissions?.includes(p)
        );

        return (

          <div key={role._id} className="bg-white p-4 mb-3 shadow">

            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{role.name}</span>

              <div className="flex gap-3 items-center">
                <span className={`px-2 py-1 text-xs rounded 
                ${role.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {role.status}
                </span>

                <button
                  onClick={() => toggleStatus(role)}
                  className="text-blue-500"
                >
                  {role.status === "active" ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this role?")) {
                      handleDelete(role._id);
                    }
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>


            <div className="mt-3">

              <div className="flex flex-wrap gap-2 items-center">

                {/* EXISTING PERMISSIONS (Capsules) */}
                {role.permissions?.map(permission => (

                  <div
                    key={permission}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {permission}

                    <button
                      onClick={async () => {

                        try {

                          const updatedPermissions = role.permissions.filter(
                            p => p !== permission
                          );

                          await updateRole(role._id, { permissions: updatedPermissions });

                          toast.success("Permission removed");

                          fetchRoles();

                        } catch (err) {
                          toast.error("Failed to remove permission");
                        }

                      }}
                      className="ml-2 text-red-500 font-bold"
                    >
                      ×
                    </button>

                  </div>

                ))}

                {/* ADD BUTTON */}
                {remainingPermissions.length > 0 && (
                  <div className="relative">

                    <button
                      onClick={() => {
                        startEditingPermissions(role);
                        setShowDropdown(!showDropdown);
                      }}
                      className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                    >
                      + Add
                    </button>

                    {/* DROPDOWN */}
                    {showDropdown && editingRoleId === role._id && (
                      <div className="absolute mt-2 bg-white border shadow-lg rounded p-2 z-50">

                        {remainingPermissions
                          .map(permission => (

                            <div
                              key={permission}
                              onClick={() => addPermission(role, permission)}
                              className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {permission}
                            </div>

                          ))}

                      </div>
                    )}

                  </div>)}

              </div>

            </div>


          </div>
        )

      })}
    </div>
  );
};

export default Roles;
