import { useState } from "react";

/**
 * Componente SearchBar
 * Barra di ricerca avanzata con filtri per categoria, parco e tipo di sollevamento
 * Permette anche di ordinare i risultati secondo diversi criteri
 */
const SearchBar = ({ onSearch, categories = [], parks = [], lifts = [] }) => {
  // Stati per i vari campi di ricerca e filtri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPark, setSelectedPark] = useState("");
  const [selectedLift, setSelectedLift] = useState("");
  const [sortBy, setSortBy] = useState("");

  //gestione del submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Invoca la callback con tutti i parametri di ricerca
    onSearch({
      searchTerm,
      category: selectedCategory,
      park: selectedPark,
      lift: selectedLift,
      sortBy,
    });
  };

  // funzione di reset per i filtri
  const resetFilters = () => {
    // Resetta tutti gli stati locali
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedPark("");
    setSelectedLift("");
    setSortBy("");
    // ricerca senza filtri
    onSearch({
      searchTerm: "",
      category: "",
      park: "",
      lift: "",
      sortBy: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Riga superiore con campo di ricerca e pulsanti */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Campo di ricerca testuale */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Cerca montagne russe..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Pulsante di ricerca */}
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white font-luckiest rounded-md hover:bg-orange-600 transition-colors drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1 cursor-pointer"
          >
            Cerca
          </button>

          {/* Pulsante di reset */}
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-luckiest rounded-md hover:bg-gray-400 transition-colors drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1 cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Griglia di filtri avanzati */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro per categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value="">Tutte le categorie</option>
              {/* Mapping dinamico delle categorie disponibili */}
              {Array.isArray(categories) &&
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Filtro per parco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parco
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedPark}
              onChange={(e) => setSelectedPark(e.target.value)}
            >
              <option value="">Tutti i parchi</option>
              {/* Mapping dinamico dei parchi disponibili */}
              {Array.isArray(parks) &&
                parks.map((park, index) => (
                  <option key={index} value={park}>
                    {park}
                  </option>
                ))}
            </select>
          </div>

          {/* Filtro per tipo di sollevamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo di sollevamento
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedLift}
              onChange={(e) => setSelectedLift(e.target.value)}
            >
              <option value="">Tutti i tipi</option>
              {/* Mapping dinamico dei tipi di sollevamento disponibili */}
              {Array.isArray(lifts) &&
                lifts.map((lift, index) => (
                  <option key={index} value={lift}>
                    {lift}
                  </option>
                ))}
            </select>
          </div>

          {/* Opzioni di ordinamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordina per
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 "
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Nessun ordinamento</option>
              <option value="title_asc">Nome (A-Z)</option>
              <option value="title_desc">Nome (Z-A)</option>
              <option value="length_asc">Lunghezza (crescente)</option>
              <option value="length_desc">Lunghezza (decrescente)</option>
              <option value="height_asc">Altezza (crescente)</option>
              <option value="height_desc">Altezza (decrescente)</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
