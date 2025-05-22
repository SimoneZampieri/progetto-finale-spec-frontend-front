import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Componente ComparisonPage
 * Pagina che permette di confrontare fianco a fianco più coaster selezionati
 * Visualizza una tabella con tutte le proprietà dei coaster per un confronto diretto
 */
const ComparisonPage = () => {
  // Estraggo valori e funzioni dal contesto globale
  const {
    coaster,
    loading,
    error,
    comparisonList,
    removeFromComparison,
    clearComparison,
  } = useGlobalContext();

  // Stato locale per memorizzare i coaster completi da confrontare
  const [comparisonCoasters, setComparisonCoasters] = useState([]);

  /**
   * Effect che filtra i coaster completi in base agli ID nella lista di confronto
   * Si attiva quando cambia la lista dei coaster o la lista di confronto
   */
  useEffect(() => {
    if (coaster && coaster.length > 0) {
      // Filtro i coaster completi per ottenere solo quelli nella lista di confronto
      const coastersToCompare = coaster.filter((coaster) =>
        comparisonList.includes(String(coaster.id))
      );
      setComparisonCoasters(coastersToCompare);
    } else {
      // Se non ci sono coaster disponibili, imposto un array vuoto
      setComparisonCoasters([]);
    }
  }, [coaster, comparisonList]);

  /**
   * Estrae dinamicamente tutte le proprietà rilevanti dai coaster da confrontare
   * Esclude proprietà non significative per il confronto (id, date, immagini)
   * @returns {Array} Array di stringhe con i nomi delle proprietà
   */
  const getAllProperties = () => {
    // Uso un Set per garantire l'unicità delle proprietà
    const properties = new Set();
    comparisonCoasters.forEach((coaster) => {
      // Per ogni coaster, itero su tutte le sue proprietà
      Object.keys(coaster).forEach((key) => {
        // Escludo proprietà non rilevanti per il confronto
        if (!["id", "createdAt", "updatedAt", "img"].includes(key)) {
          // Aggiungo la proprietà al Set
          properties.add(key);
        }
      });
    });
    // Riconverto il Set in array per poterlo utilizzare nel rendering
    return Array.from(properties);
  };

  // Ottengo l'elenco di tutte le proprietà da visualizzare
  const properties = getAllProperties();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Confronta Coasters
      </h1>

      {/* Messaggio se non ci sono coaster da confrontare */}
      {comparisonCoasters.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-luckiest text-xl mb-4">
            Non hai ancora aggiunto coaster da confrontare!
          </p>
          <Link
            to="/coasters"
            className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded hover:bg-orange-700 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1"
          >
            Torna alla lista
          </Link>
        </div>
      ) : (
        <>
          {/* Intestazione con conteggio e pulsante per cancellare */}
          <div className="mb-6 flex justify-between items-center">
            <p className="font-luckiest">
              Confronto di {comparisonCoasters.length} coaster
            </p>
            <button
              onClick={clearComparison}
              className="bg-red-500 text-white font-luckiest px-3 py-1 rounded hover:bg-red-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-red-600 active:translate-y-1"
            >
              Cancella confronto
            </button>
          </div>

          {/* Tabella di confronto con scroll orizzontale per dispositivi piccoli */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {/* Intestazione colonna proprietà */}
                  <th className="py-2 px-4 border-b border-r border-gray-200 bg-gray-100 text-left font-luckiest">
                    Proprietà
                  </th>
                  {/* Intestazioni colonne per ogni coaster */}
                  {comparisonCoasters.map((item) => (
                    <th
                      key={item.id}
                      className="py-2 px-4 border-b border-r border-gray-200 bg-gray-100"
                    >
                      <div className="flex flex-col items-center">
                        {/* Immagine del coaster */}
                        <div className="h-32 w-full mb-2">
                          {item.img ? (
                            <img
                              src={`/src/assets/${item.img}`}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/200x100/gray/white?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                Nessuna immagine
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Titolo del coaster */}
                        <h3 className="font-luckiest text-lg">{item.title}</h3>
                        {/* Pulsanti per dettagli e rimozione */}
                        <div className="flex mt-2">
                          <Link
                            to={`/rollercoaster/${item.id}`}
                            className="bg-orange-500 text-black font-luckiest text-xs px-2 py-1 rounded hover:bg-orange-700 mr-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1"
                          >
                            Dettagli
                          </Link>
                          <button
                            onClick={() => removeFromComparison(item.id)}
                            className="bg-red-500 text-white font-luckiest text-xs px-2 py-1 rounded hover:bg-red-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-red-600 active:translate-y-1"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Righe per ogni proprietà */}
                {properties.map((property) => (
                  <tr key={property} className="hover:bg-gray-50">
                    {/* Nome della proprietà (prima colonna) */}
                    <td className="py-2 px-4 border-b border-r border-gray-200 font-medium capitalize">
                      {property}
                    </td>
                    {/* Valori per ogni coaster */}
                    {comparisonCoasters.map((item) => (
                      <td
                        key={`${item.id}-${property}`}
                        className="py-2 px-4 border-b border-r border-gray-200 text-center"
                      >
                        {/* Gestione di diversi tipi di valori con fallback per valori mancanti */}
                        {item[property] !== undefined ? (
                          typeof item[property] === "boolean" ? (
                            item[property] ? (
                              "Sì"
                            ) : (
                              "No"
                            )
                          ) : (
                            item[property]
                          )
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonPage;
