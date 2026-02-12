import { useEffect, useState } from "react";
import { getSites, createSite, deleteSite,getTimezones } from "../services/siteService";

const Sites = () => {

  const [sites, setSites] = useState([]);
  const [timezones, setTimezones] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");

  // fetch sites
  const fetchSites = async () => {
    const data = await getSites();
    setSites(data);
  };

const fetchTimezones = async () => {
  const res = await getTimezones();
  setTimezones(res);
};

  useEffect(() => {
    fetchSites();
    fetchTimezones();
  }, []);

  // create site
  const handleCreate = async (e) => {
    e.preventDefault();

    await createSite({ name, location, timezone });

    setName("");
    setLocation("");
    setTimezone("");

    fetchSites();
  };

  // delete site
  const handleDelete = async (id) => {
    try {
      await deleteSite(id);
      fetchSites();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Sites</h1>

      {/* Create Site Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow mb-6 space-y-4">

        <div>
          <label className="block mb-1">Site Name</label>
          <input
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            className="border w-full p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Timezone</label>
          <select
            className="border w-full p-2 rounded"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          >
            <option value="">Select Timezone</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Site
        </button>

      </form>

      {/* Site List */}
      <div className="space-y-3">
        {sites.map(site => (
          <div key={site._id} className="bg-white p-4 shadow rounded flex justify-between items-center">

            <div>
              <p className="font-bold">{site.name}</p>
              <p className="text-sm text-gray-500">{site.location}</p>
              <p className="text-xs text-gray-400">{site.timezone}</p>
            </div>

            <button
              onClick={() => handleDelete(site._id)}
              className="text-red-500"
            >
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Sites;