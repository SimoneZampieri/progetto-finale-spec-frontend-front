import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

/**
 * Componente CoasterList
 * Visualizza l'elenco di tutti i coaster con funzionalità di ricerca e filtro
 * Permette di navigare ai dettagli e aggiungere coaster al confronto
 */
const CoasterList = () => {
  // Estraggo i dati e le funzioni necessarie dal contesto globale
  const {
    coaster,
    loading,
    error,
    addToComparison,
    removeFromComparison,
    isInComparison,
  } = useGlobalContext();

  // Stati locali per gestire i coaster filtrati e le opzioni di filtro
  const [filteredCoasters, setFilteredCoasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parks, setParks] = useState([]);
  const [lifts, setLifts] = useState([]);

  /**
   * Effect che si attiva quando cambia l'array dei coaster
   * Inizializza i coaster filtrati e estrae le opzioni uniche per i filtri
   */
  useEffect(() => {
    if (coaster && coaster.length > 0) {
      // Inizialmente mostro tutti i coaster
      setFilteredCoasters(coaster);

      // Estraggo le categorie uniche per il filtro
      const uniqueCategories = [
        ...new Set(
          coaster.filter((item) => item.category).map((item) => item.category)
        ),
      ];

      // Verifico se ci sono parchi definiti e estraggo i valori unici
      const hasParks = coaster.some((item) => item.park !== undefined);
      const uniqueParks = hasParks
        ? [
            ...new Set(
              coaster.filter((item) => item.park).map((item) => item.park)
            ),
          ]
        : [];

      // Verifico se ci sono tipi di sollevamento definiti e estraggo i valori unici
      const hasLifts = coaster.some((item) => item.lift !== undefined);
      const uniqueLifts = hasLifts
        ? [
            ...new Set(
              coaster.filter((item) => item.lift).map((item) => item.lift)
            ),
          ]
        : [];

      // Aggiorno gli stati con le opzioni di filtro
      setCategories(uniqueCategories);
      setParks(uniqueParks);
      setLifts(uniqueLifts);
    }
  }, [coaster]);

  /**
   * Gestisce la ricerca e il filtraggio dei coaster
   * @param {Object} params - Parametri di ricerca e filtro
   * @param {string} params.searchTerm - Termine di ricerca per il titolo
   * @param {string} params.category - Categoria selezionata
   * @param {string} params.park - Parco selezionato
   * @param {string} params.lift - Tipo di sollevamento selezionato
   * @param {string} params.sortBy - Criterio di ordinamento
   */
  const handleSearch = ({ searchTerm, category, park, lift, sortBy }) => {
    if (!coaster) return;

    // Creo una copia dell'array originale per non modificarlo direttamente
    let results = [...coaster];

    // Filtro per titolo (case insensitive)
    if (searchTerm && searchTerm.trim() !== "") {
      results = results.filter(
        (item) =>
          item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Filtro per categoria
    if (category && category !== "") {
      results = results.filter((item) => item.category === category);
    }

    // Filtro per parco
    if (park && park !== "") {
      results = results.filter((item) => item.park === park);
    }

    // Filtro per tipo di sollevamento
    if (lift && lift !== "") {
      results = results.filter((item) => item.lift === lift);
    }

    // Ordinamento dei risultati in base al criterio selezionato
    if (sortBy && sortBy !== "") {
      switch (sortBy) {
        case "title_asc":
          // Ordine alfabetico crescente
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title_desc":
          // Ordine alfabetico decrescente
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "length_asc":
          // Lunghezza crescente (con gestione di valori null/undefined)
          results.sort(
            (a, b) => (Number(a.length) || 0) - (Number(b.length) || 0)
          );
          break;
        case "length_desc":
          // Lunghezza decrescente
          results.sort(
            (a, b) => (Number(b.length) || 0) - (Number(a.length) || 0)
          );
          break;
        case "height_asc":
          // Altezza crescente
          results.sort(
            (a, b) => (Number(a.height) || 0) - (Number(b.height) || 0)
          );
          break;
        case "height_desc":
          // Altezza decrescente
          results.sort(
            (a, b) => (Number(b.height) || 0) - (Number(a.height) || 0)
          );
          break;
        default:
          break;
      }

      // Log per debug dei primi 5 risultati dopo l'ordinamento
      console.log("Valori dopo il sort");
      results.slice(0, 5).forEach((item, i) => {
        console.log(
          `${i}: ${item.title} - height: ${item.height}, length: ${item.length}`
        );
      });
    }

    console.log("Final results:", results.length);
    // Aggiorno lo stato con i risultati filtrati e ordinati
    setFilteredCoasters(results);
  };

  // Gestione degli stati di caricamento ed errore
  if (loading)
    return (
      <div className="text-center font-luckiest py-8">Finisco il giro...</div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">{error}</div>
    );

  // Uso i coaster filtrati o un array vuoto se non disponibili
  const coasterList = filteredCoasters || [];

  return (
    <div className="container mx-auto px-4 my-3">
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Lista Coasters
      </h1>

      {/* Componente SearchBar per i filtri e la ricerca */}
      <SearchBar
        onSearch={handleSearch}
        categories={categories}
        parks={parks}
        lifts={lifts}
      />

      {/* Messaggio se non ci sono risultati */}
      {coasterList.length === 0 ? (
        <p className="text-center font-luckiest py-8">
          Nessun coaster trovato.
        </p>
      ) : (
        // Griglia responsive di card per i coaster
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {coasterList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Sezione immagine */}
              <div className="h-48 overflow-hidden">
                {item.img ? (
                  <img
                    src={`/src/assets/${item.img}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x200/gray/white?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Nessuna immagine</span>
                  </div>
                )}
              </div>

              {/* Sezione contenuto */}
              <div className="p-6">
                <h2 className="text-xl font-semibold font-luckiest mb-2">
                  {item.title}
                </h2>
                <div className="text-gray-600 mb-4">
                  <p className="font-luckiest">
                    Categoria: {item.category || "N/A"}
                  </p>
                  {item.park && <p>Parco: {item.park}</p>}
                  {item.height && <p>Altezza: {item.height} m</p>}
                  {item.length && <p>Lunghezza: {item.length} m</p>}
                </div>
                {/* Pulsanti per dettagli e confronto */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/rollercoaster/${item.id}`}
                    className="bg-orange-500 text-black font-luckiest px-3 py-1 rounded hover:bg-orange-700 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1 my-3"
                  >
                    Vedi dettagli
                  </Link>
                  <button
                    className={`${
                      isInComparison(item.id) ? "bg-green-700" : "bg-green-500"
                    } text-black font-luckiest px-3 py-1 rounded hover:bg-green-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-green-600 active:translate-y-1 my-3`}
                    onClick={() =>
                      isInComparison(item.id)
                        ? removeFromComparison(item.id)
                        : addToComparison(item.id)
                    }
                  >
                    {isInComparison(item.id)
                      ? "Rimuovi confronto"
                      : "Confronta"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoasterList;
