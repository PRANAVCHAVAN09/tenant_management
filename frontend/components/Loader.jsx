import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

const Loader = () => {
  const { loading } = useContext(LoaderContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-semibold text-gray-700">Please wait...</span>
      </div>
    </div>
  );
};

export default Loader;
