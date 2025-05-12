import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [coaster, setCoaster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //stato per comparazione
  const [comparisonList, setComparisonList] = useState(() => {
    //inizializzo la lista dei preferiti da localstorage
    const storedComparisonList = localStorage.getItem("comparisonCoasters");
    return storedComparisonList ? JSON.parse(storedComparisonList) : [];
  });

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

      let data = await response.json();
      console.log("API Response:", data);

      let Promises = [];
      data.map((coaster) => {
        Promises.push(fetch(`${API_URL}/${resourceType}/${coaster.id}`));
      });

      // prendo i dettagli da ogni coaster e li aggiungo
      const detailedResponses = await Promise.all(Promises).then(
        (responses) => {
          return Promise.all(responses.map((response) => response.json()));
        }
      );

      // estraggo i dati del coaster
      const extractedData = detailedResponses.map((item) => {
        // check se i dati sono annidati all'interno di rollercoaster
        if (item.rollercoaster) {
          return item.rollercoaster;
        }
        return item;
      });

      console.log("Extracted coaster data:", extractedData[0]);

      // aggiorno data con le info dettagliate
      data = extractedData;

      if (data.length > 0) {
        console.log("First coaster properties:", Object.keys(data[0]));

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

  //salvo la lista da comparare in localStorage quando cambia
  useEffect(() => {
    localStorage.setItem("comparisonCoasters", JSON.stringify(comparisonList));
  }, [comparisonList]);

  //aggiungo coaster al comparatore
  const addToComparison = (coasterId) => {
    const idToAdd = String(coasterId);
    setComparisonList((prev) => {
      if (prev.includes(idToAdd)) {
        return prev;
      }
      return [...prev, idToAdd];
    });
  };

  //rimuovo coaster dal comparatore
  const removeFromComparison = (coasterId) => {
    const idToRemove = String(coasterId);
    setComparisonList((prev) => prev.filter((id) => id !== idToRemove));
  };

  //check se il coaster è nel comparatore
  const isInComparison = (coasterId) => {
    return comparisonList.includes(String(coasterId));
  };

  //ripulisco il comparatore
  const clearComparison = () => {
    setComparisonList([]);
  };

  const value = {
    coaster,
    loading,
    error,
    fetchCoasters,
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
