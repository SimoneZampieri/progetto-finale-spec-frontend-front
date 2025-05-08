import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [coaster, setCoaster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //url della API
  const API_URL = import.meta.env.VITE_API_URL;

  const resourceType = "rollercoasters";

  //fetch di tutti i coaster
  const fetchCoasters = async () => {
    try {
      setLoading(true);
      // Remove the extra "s" since resourceType already has "s"
      const response = await fetch(`${API_URL}/${resourceType}`);

      if (!response.ok) {
        throw new Error(`Risposta negativa: ${response.status}`);
      }

      // Need to parse the JSON response
      const data = await response.json();
      console.log("API Response:", data);

      setCoaster(data);
      setError(null);
    } catch (err) {
      console.error("Errore nel fetch dei coaster", err);
      setError("Errore nel caricamento, riprova più tardi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoasters();
  }, []);

  const value = {
    coaster,
    loading,
    error,
    fetchCoasters,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContext;
