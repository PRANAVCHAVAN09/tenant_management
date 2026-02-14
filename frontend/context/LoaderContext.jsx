import { createContext, useState } from "react";
import { registerLoader } from "../services/loaderService";
import { useEffect } from "react";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  useEffect(() => {
    registerLoader(showLoader, hideLoader);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {children}
    </LoaderContext.Provider>
  );
};
