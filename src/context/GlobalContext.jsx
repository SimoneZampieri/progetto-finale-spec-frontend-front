import { createContext, useContext, useState, useEffect } from "react";

/**
 * Creazione del contesto globale per l'applicazione
 * Gestisce lo stato condiviso tra i componenti
 */
const GlobalContext = createContext();

/**
 * Hook personalizzato per accedere facilmente al contesto globale
 */
export const useGlobalContext = () => useContext(GlobalContext);

/**
 * Provider del contesto globale
 * Gestisce lo stato dell'applicazione e fornisce funzioni per manipolarlo
 */
export const GlobalProvider = ({ children }) => {
  // Stati principali per i dati dei coaster
  const [coaster, setCoaster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stato per la lista dei coaster da confrontare
  const [comparisonList, setComparisonList] = useState(() => {
    // Inizializzo la lista dei coaster da confrontare da localStorage
    const storedComparisonList = localStorage.getItem("comparisonCoasters");
    return storedComparisonList ? JSON.parse(storedComparisonList) : [];
  });

  // URL dell'API preso dalle variabili d'ambiente
  const API_URL = import.meta.env.VITE_API_URL;

  // Tipo di risorsa per le chiamate API
  const resourceType = "rollercoasters";

  /**
   * Recupera tutti i coaster dall'API
   * Effettua una prima chiamata per ottenere la lista, poi richiede i dettagli di ogni coaster
   */
  const fetchCoasters = async () => {
    try {
      setLoading(true);
      // Prima chiamata per ottenere la lista di tutti i coaster
      const response = await fetch(`${API_URL}/${resourceType}`);

      if (!response.ok) {
        throw new Error(`Risposta negativa: ${response.status}`);
      }

      let data = await response.json();
      console.log("API Response:", data);

      // Creo un array di promise per ottenere i dettagli di ogni coaster
      let Promises = [];
      data.map((coaster) => {
        Promises.push(fetch(`${API_URL}/${resourceType}/${coaster.id}`));
      });

      // Attendo tutte le risposte e le converto in JSON
      const detailedResponses = await Promise.all(Promises).then(
        (responses) => {
          return Promise.all(responses.map((response) => response.json()));
        }
      );

      // Estraggo i dati del coaster dalla struttura della risposta
      const extractedData = detailedResponses.map((item) => {
        // Check se i dati sono annidati all'interno di rollercoaster
        if (item.rollercoaster) {
          return item.rollercoaster;
        }
        return item;
      });

      console.log("Extracted coaster data:", extractedData[0]);

      // Aggiorno data con le info dettagliate
      data = extractedData;

      // Verifico la validità dei dati ricevuti
      if (data.length > 0) {
        console.log("First coaster properties:", Object.keys(data[0]));

        // Definisco le proprietà che ci si aspetta di trovare
        const expectedProps = [
          "id",
          "title",
          "category",
          "park",
          "lift",
          "height",
          "length",
        ];

        // Controllo se ci sono proprietà mancanti
        const missingProps = expectedProps.filter(
          (prop) => !data[0].hasOwnProperty(prop)
        );
        // Se mancano proprietà, mostro un avviso in console
        if (missingProps.length > 0) {
          console.warn("Missing properties in coaster data:", missingProps);
        }
      }

      // Aggiorno lo stato con i dati ricevuti
      setCoaster(data);
      setError(null);
    } catch (err) {
      console.error("Errore nel fetch dei coaster", err);
      setError("Errore nel caricamento, riprova più tardi!");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect che carica i coaster all'avvio dell'applicazione
   */
  useEffect(() => {
    fetchCoasters();
  }, []);

  /**
   * Effect che salva la lista di confronto in localStorage quando cambia
   */
  useEffect(() => {
    localStorage.setItem("comparisonCoasters", JSON.stringify(comparisonList));
  }, [comparisonList]);

  /**
   * Aggiunge un coaster alla lista di confronto
   */
  const addToComparison = (coasterId) => {
    const idToAdd = String(coasterId);
    setComparisonList((prev) => {
      // Evita duplicati nella lista
      if (prev.includes(idToAdd)) {
        return prev;
      }
      return [...prev, idToAdd];
    });
  };

  /**
   * Rimuove un coaster dalla lista di confronto
   */
  const removeFromComparison = (coasterId) => {
    const idToRemove = String(coasterId);
    setComparisonList((prev) => prev.filter((id) => id !== idToRemove));
  };

  /**
   * Verifica se un coaster è presente nella lista di confronto
   */
  const isInComparison = (coasterId) => {
    return comparisonList.includes(String(coasterId));
  };

  /**
   * Svuota completamente la lista di confronto
   */
  const clearComparison = () => {
    setComparisonList([]);
  };

  // Oggetto con tutti i valori e le funzioni da condividere nel contesto
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
