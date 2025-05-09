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

  useEffect(() => {
    if (coaster && coaster.length > 0) {
      console.log("Coaster data sample:", coaster[0]);
      console.log("Available properties:", Object.keys(coaster[0]));

      setFilteredCoasters(coaster);

      // Only extract properties that exist and are not undefined
      const uniqueCategories = [
        ...new Set(
          coaster.filter((item) => item.category).map((item) => item.category)
        ),
      ];

      // Check if park property exists in any coaster
      const hasParks = coaster.some((item) => item.park !== undefined);
      const uniqueParks = hasParks
        ? [
            ...new Set(
              coaster.filter((item) => item.park).map((item) => item.park)
            ),
          ]
        : [];

      // Check if lift property exists in any coaster
      const hasLifts = coaster.some((item) => item.lift !== undefined);
      const uniqueLifts = hasLifts
        ? [
            ...new Set(
              coaster.filter((item) => item.lift).map((item) => item.lift)
            ),
          ]
        : [];

      console.log("Unique categories:", uniqueCategories);
      console.log("Unique parks:", uniqueParks, "Has parks:", hasParks);
      console.log("Unique lifts:", uniqueLifts, "Has lifts:", hasLifts);

      setCategories(uniqueCategories);
      setParks(uniqueParks);
      setLifts(uniqueLifts);
    }
  }, [coaster]);

  const handleSearch = ({ searchTerm, category, park, lift, sortBy }) => {
    if (!coaster) return;

    console.log("Search params:", { searchTerm, category, park, lift, sortBy });
    console.log("Initial coasters:", coaster.length);

    let results = [...coaster];

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      results = results.filter(
        (item) =>
          item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      console.log("After title filter:", results.length);
    }

    // Filter by category
    if (category && category !== "") {
      results = results.filter((item) => item.category === category);
      console.log("After category filter:", results.length);
    }

    // Filter by park
    if (park && park !== "") {
      // Log all unique park values in the current results
      const currentParks = [...new Set(results.map((item) => item.park))];
      console.log("Available parks in current results:", currentParks);
      console.log("Filtering for park:", park);

      results = results.filter((item) => item.park === park);
      console.log("After park filter:", results.length);
    }

    // Filter by lift
    if (lift && lift !== "") {
      // Log all unique lift values in the current results
      const currentLifts = [...new Set(results.map((item) => item.lift))];
      console.log("Available lifts in current results:", currentLifts);
      console.log("Filtering for lift:", lift);

      results = results.filter((item) => item.lift === lift);
      console.log("After lift filter:", results.length);
    }

    // Sort results
    if (sortBy && sortBy !== "") {
      console.log("Sorting by:", sortBy);

      // Log the values before sorting
      console.log("Values before sorting:");
      results.slice(0, 5).forEach((item, i) => {
        console.log(
          `${i}: ${item.title} - height: ${item.height}, length: ${item.length}`
        );
      });

      switch (sortBy) {
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

      // Log the values after sorting
      console.log("Values after sorting:");
      results.slice(0, 5).forEach((item, i) => {
        console.log(
          `${i}: ${item.title} - height: ${item.height}, length: ${item.length}`
        );
      });
    }

    console.log("Final results:", results.length);
    setFilteredCoasters(results);
  };

  if (loading)
    return (
      <div className="text-center font-luckiest py-8">Finisco il giro...</div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">{error}</div>
    );

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
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
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
                <button className="bg-purple-500 text-white font-luckiest px-3 py-1 rounded hover:bg-purple-600">
                  Aggiungi ai Preferiti
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
