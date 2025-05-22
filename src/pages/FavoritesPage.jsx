import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Componente FavoritesPage
 * Visualizza i coaster che l'utente ha salvato come preferiti
 * Permette di visualizzare i dettagli e rimuovere coaster dai preferiti
 */
const FavoritesPage = () => {
  const { coaster, loading, error } = useGlobalContext();
  const [favorites, setFavorites] = useState([]);
  const [favoriteCoasters, setFavoriteCoasters] = useState([]);

  /**
   * Effect che carica i preferiti da localStorage all'avvio del componente
   */
  useEffect(() => {
    // Carico i preferiti dal localStorage
    const savedFavorites = localStorage.getItem("favoriteCoasters");
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(parsedFavorites);
  }, []);

  /**
   * Effect che filtra i coaster per mostrare solo quelli nei preferiti
   * Si attiva quando cambiano i coaster disponibili o la lista dei preferiti
   */
  useEffect(() => {
    // Filtro i coaster per quelli che sono fra i preferiti
    if (coaster && coaster.length > 0) {
      const filteredCoasters = coaster.filter((item) =>
        favorites.includes(String(item.id))
      );
      setFavoriteCoasters(filteredCoasters);
    } else {
      setFavoriteCoasters([]);
      // Se non ci sono coaster setto i coaster come array vuoto
    }
  }, [coaster, favorites]);

  /**
   * Rimuove un coaster dalla lista dei preferiti
   * @param {string|number} coasterId - ID del coaster da rimuovere
   */
  const removeFromFavorites = (coasterId) => {
    const idToRemove = String(coasterId);
    const newFavorites = favorites.filter((id) => id !== idToRemove);
    setFavorites(newFavorites);
    localStorage.setItem("favoriteCoasters", JSON.stringify(newFavorites));
  };

  // Gestione degli stati di caricamento ed errore
  if (loading)
    return <div className="text-center font-luckiest py-8">Caricamento...</div>;
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">{error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        I Miei Preferiti
      </h1>

      {/* Messaggio se non ci sono preferiti */}
      {favoriteCoasters.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-luckiest text-xl mb-4">
            Non hai ancora aggiunto preferiti!
          </p>
          <Link
            to="/coasters"
            className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded hover:bg-orange-700"
          >
            Torna alla lista
          </Link>
        </div>
      ) : (
        // Griglia di card per i coaster preferiti
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCoasters.map((item) => (
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
                {/* Pulsanti per dettagli e rimozione dai preferiti */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/rollercoaster/${item.id}`}
                    className="bg-orange-500 text-black font-luckiest px-3 py-1 rounded hover:bg-orange-700 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1 my-3 cursor-pointer"
                  >
                    Vedi dettagli
                  </Link>
                  <button
                    className="bg-red-500 text-white font-luckiest px-3 py-1 rounded hover:bg-red-600 flex items-center drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-red-600 active:translate-y-1 my-3 cursor-pointer"
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    Rimuovi dai preferiti
                    <span className="ml-1">★</span>
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

export default FavoritesPage;
