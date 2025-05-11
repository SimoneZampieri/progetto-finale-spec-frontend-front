import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const FavoritesPage = () => {
  const { coaster, loading, error } = useGlobalContext();
  const [favorites, setFavorites] = useState([]);
  const [favoriteCoasters, setFavoriteCoasters] = useState([]);

  useEffect(() => {
    //carico i preferiti dal LocalStorGE
    const savedFavorites = localStorage.getItem("favoriteCoasters");
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(parsedFavorites);
  }, []);

  useEffect(() => {
    //filtro i coaster per quelli che sono fra i preferiti
    if (coaster && coaster.length > 0) {
      const filteredCoasters = coaster.filter((item) =>
        favorites.includes(item.id)
      );
      setFavoriteCoasters(filteredCoasters);
    } else {
      setFavoriteCoasters([]);
      //se non ci sono coaster setto i coaster come array vuoto
    }
  }, [coaster, favorites]);

  //funzione che rimuove dai preferiti
  const removeFromFavorites = (coasterId) => {
    const newFavorites = favorites.filter((id) => id !== coasterId);
    setFavorites(newFavorites);
    localStorage.setItem("favoriteCoasters", JSON.stringify(newFavorites));
  };

  //se non ci sono coaster mostro un messaggio o se c'è un caricamento
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

      {favoriteCoasters.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-luckiest text-xl mb-4">
            Non hai ancora aggiunto preferiti!
          </p>
          <Link
            to="/"
            className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded hover:bg-orange-700"
          >
            Torna alla lista
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCoasters.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image section */}
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

              {/* Content section */}
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
