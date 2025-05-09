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
      const response = await fetch(`${API_URL}/${resourceType}`);

      if (!response.ok) {
        throw new Error(`Risposta negativa: ${response.status}`);
      }

      // Parse the JSON response
      let data = await response.json();
      console.log("API Response:", data);

      let Promises = [];
      data.map((coaster) => {
        Promises.push(fetch(`${API_URL}/${resourceType}/${coaster.id}`));
      });

      // Get detailed data for each coaster
      const detailedResponses = await Promise.all(Promises).then(
        (responses) => {
          return Promise.all(responses.map((response) => response.json()));
        }
      );

      // Extract the actual coaster data from the response structure
      const extractedData = detailedResponses.map((item) => {
        // Check if the data is nested inside a rollercoaster property
        if (item.rollercoaster) {
          return item.rollercoaster;
        }
        return item; // Fallback if structure is different
      });

      console.log("Extracted coaster data:", extractedData[0]);

      // Update data with the extracted detailed information
      data = extractedData;

      // Check if we have all the required properties in the first item
      if (data.length > 0) {
        console.log("First coaster properties:", Object.keys(data[0]));
        // Check for missing properties
        const expectedProps = [
          "id",
          "title",
          "category",
          "park",
          "lift",
          "height",
          "length",
        ];
        const missingProps = expectedProps.filter(
          (prop) => !data[0].hasOwnProperty(prop)
        );
        if (missingProps.length > 0) {
          console.warn("Missing properties in coaster data:", missingProps);
        }
      }

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
