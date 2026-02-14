import { useEffect, useState } from "react";
import { getPaginatedSites, createSite, deleteSite,getTimezones } from "../services/siteService";
import { useRef } from "react";


const Sites = () => {

  const [sites, setSites] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const observer = useRef();
  const firstLoad = useRef(true);
  const scrollContainerRef = useRef(null);
 useEffect(() => {
    // fetchSites();
    fetchTimezones();
  }, []);

useEffect(() => {

  if (firstLoad.current) {
    firstLoad.current = false;
    fetchSites();
    return;
  }

  fetchSites();

}, [page]);


  // fetch sites
const fetchSites = async () => {

  if (loading || !hasMore) return;

  setLoading(true);

  const data = await getPaginatedSites(page);

 

  setSites(prev => {
  const newSites = data?.filter(
    newSite => !prev.some(existing => existing._id === newSite._id)
  );
  return [...prev, ...newSites];
});

  setHasMore(data?.hasMore);

  setLoading(false);
};

const lastSiteRef = (node) => {

  if (loading) return;

  if (observer.current) observer.current.disconnect();

  observer.current = new IntersectionObserver(entries => {

    if (entries[0].isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }

  });

  if (node) observer.current.observe(node);
};
const fetchTimezones = async () => {
  const res = await getTimezones();
  setTimezones(res);
};

 



  // create site
  const handleCreate = async (e) => {
    try {
      
      e.preventDefault();
  
      await createSite({ name, location, timezone });
  
      setName("");
      setLocation("");
      setTimezone("");
  
    setSites([]);
    setPage(1);
    setHasMore(true);
    } catch (error) {
      console.log(error,"988888")
      
    }
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
   <div className="bg-white rounded-lg shadow border h-[400px] flex flex-col">

  <div className="p-4 border-b font-semibold">
    Site List
  </div>

  <div
    ref={scrollContainerRef}
    className="flex-1 overflow-y-auto p-4 space-y-3"
  >
    {sites.map((site, index) => {

      if (sites.length === index + 1) {
        return (
          <div
            ref={lastSiteRef}
            key={site._id}
            className="bg-gray-50 hover:bg-gray-100 transition p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{site.name}</p>
              <p className="text-sm text-gray-500">{site.location}</p>
              <p className="text-xs text-gray-400">{site.timezone}</p>
            </div>

            <button
              onClick={() => handleDelete(site._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        );
      }

      return (
        <div
          key={site._id}
          className="bg-gray-50 hover:bg-gray-100 transition p-4 rounded flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{site.name}</p>
            <p className="text-sm text-gray-500">{site.location}</p>
            <p className="text-xs text-gray-400">{site.timezone}</p>
          </div>

          <button
            onClick={() => handleDelete(site._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      );
    })}

    {loading && (
      <p className="text-center text-gray-500 py-3">
        Loading more sites...
      </p>
    )}
  </div>
</div>


    </div>
  );
};

export default Sites;