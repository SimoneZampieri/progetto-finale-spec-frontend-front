import { useState, useEffect } from "react";

const SearchBar = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, category: selectedCategory });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Cerca montagne russe..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="md:w-1/4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tutte le categorie</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Cerca
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
