import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const context = useGlobalContext();
  const { coaster, loading, error } = context;
  
  const [filteredCoasters, setFilteredCoasters] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (coaster) {
      setFilteredCoasters(coaster);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(coaster.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  }, [coaster]);

  const handleSearch = ({ searchTerm, category }) => {
    if (!coaster) return;
    
    let results = [...coaster];
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category) {
      results = results.filter(item => item.category === category);
    }
    
    setFilteredCoasters(results);
  };

  if (loading)
    return (
      <div className="text-center font-luckiest py-8">Finisco il giro...</div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">
        {error}
      </div>
    );

  const coasterList = filteredCoasters || [];

  return (
    <div>
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Lista Coasters
      </h1>

      <SearchBar onSearch={handleSearch} categories={categories} />

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
              <p className="text-gray-600 font-luckiest mb-4">
                Categoria: {item.category}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/detail/${item.id}`}
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
