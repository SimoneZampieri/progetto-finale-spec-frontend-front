import { useState } from "react";

const SearchBar = ({ onSearch, categories = [], parks = [], lifts = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPark, setSelectedPark] = useState("");
  const [selectedLift, setSelectedLift] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      category: selectedCategory,
      park: selectedPark,
      lift: selectedLift,
      sortBy,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Cerca montagne russe..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white font-luckiest rounded-md hover:bg-orange-600 transition-colors"
          >
            Cerca
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tutte le categorie</option>
              {Array.isArray(categories) &&
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

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
              {Array.isArray(parks) &&
                parks.map((park, index) => (
                  <option key={index} value={park}>
                    {park}
                  </option>
                ))}
            </select>
          </div>

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
              {Array.isArray(lifts) &&
                lifts.map((lift, index) => (
                  <option key={index} value={lift}>
                    {lift}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordina per
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Nessun ordinamento</option>
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
