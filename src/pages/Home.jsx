import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const context = useGlobalContext();
  const { coaster, loading, error } = context;

  const [filteredCoasters, setFilteredCoasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parks, setParks] = useState([]);
  const [lifts, setLifts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    //inizializzo favorites con i coaster salvati nel localStorage
    const savedFavorites = localStorage.getItem("favoriteCoasters");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  //funzione per aggoingere/rimuovere dai preferiti
  const toggleFavorite = (coasterId) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(coasterId)) {
        //rimozione
        newFavorites = prevFavorites.filter((id) => id !== coasterId);
      } else {
        //aggiunta
        newFavorites = [...prevFavorites, coasterId];
      }
      //salvataggio nel localStorage
      localStorage.setItem("favoriteCoasters", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  useEffect(() => {
    if (coaster && coaster.length > 0) {
      setFilteredCoasters(coaster);

      //check delle categorie
      const uniqueCategories = [
        ...new Set(
          coaster.filter((item) => item.category).map((item) => item.category)
        ),
      ];

      const hasParks = coaster.some((item) => item.park !== undefined);
      const uniqueParks = hasParks
        ? [
            ...new Set(
              coaster.filter((item) => item.park).map((item) => item.park)
            ),
          ]
        : [];

      const hasLifts = coaster.some((item) => item.lift !== undefined);
      const uniqueLifts = hasLifts
        ? [
            ...new Set(
              coaster.filter((item) => item.lift).map((item) => item.lift)
            ),
          ]
        : [];

      setCategories(uniqueCategories);
      setParks(uniqueParks);
      setLifts(uniqueLifts);
    }
  }, [coaster]);
  //fine check

  //ricerca per titolo, categoria, parco, lift, ordinamento
  const handleSearch = ({ searchTerm, category, park, lift, sortBy }) => {
    if (!coaster) return;

    let results = [...coaster];

    if (searchTerm && searchTerm.trim() !== "") {
      results = results.filter(
        (item) =>
          item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    if (category && category !== "") {
      results = results.filter((item) => item.category === category);
      c;
    }

    if (park && park !== "") {
      const currentParks = [...new Set(results.map((item) => item.park))];

      results = results.filter((item) => item.park === park);
    }

    if (lift && lift !== "") {
      const currentLifts = [...new Set(results.map((item) => item.lift))];

      results = results.filter((item) => item.lift === lift);
    }

    if (sortBy && sortBy !== "") {
      switch (sortBy) {
        case "title_asc":
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title_desc":
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "length_asc":
          results.sort(
            (a, b) => (Number(a.length) || 0) - (Number(b.length) || 0)
          );
          break;
        case "length_desc":
          results.sort(
            (a, b) => (Number(b.length) || 0) - (Number(a.length) || 0)
          );
          break;
        case "height_asc":
          results.sort(
            (a, b) => (Number(a.height) || 0) - (Number(b.height) || 0)
          );
          break;
        case "height_desc":
          results.sort(
            (a, b) => (Number(b.height) || 0) - (Number(a.height) || 0)
          );
          break;
        default:
          break;
      }

      console.log("Valori dopo il sort");
      results.slice(0, 5).forEach((item, i) => {
        console.log(
          `${i}: ${item.title} - height: ${item.height}, length: ${item.length}`
        );
      });
    }

    console.log("Final results:", results.length);
    setFilteredCoasters(results);
  };
  //fine ricerca

  if (loading)
    return (
      <div className="text-center font-luckiest py-8">Finisco il giro...</div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">{error}</div>
    );

  //stampa lista coasters
  const coasterList = filteredCoasters || [];

  return (
    <div>
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Lista Coasters
      </h1>

      <SearchBar
        onSearch={handleSearch}
        categories={categories}
        parks={parks}
        lifts={lifts}
      />

      {coasterList.length === 0 ? (
        <p className="text-center font-luckiest">Nessun coaster trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coasterList.map((item) => (
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
                    className="bg-orange-500 text-black font-luckiest px-3 py-1 rounded hover:bg-orange-700"
                  >
                    Vedi dettagli
                  </Link>
                  <button className="bg-green-500 text-black font-luckiest px-3 py-1 rounded hover:bg-green-600">
                    Confronta
                  </button>
                  <button 
                    className={`${
                      favorites.includes(item.id) 
                        ? "bg-purple-700" 
                        : "bg-purple-500"
                    } text-white font-luckiest px-3 py-1 rounded hover:bg-purple-600 flex items-center`}
                    onClick={() => toggleFavorite(item.id)}
                  >
                    {favorites.includes(item.id) ? "Rimuovi" : "Aggiungi ai Preferiti"}
                    {favorites.includes(item.id) && (
                      <span className="ml-1">★</span>
                    )}
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

export default Home;
