import React from "react";
import { useGlobalContext } from "../context/GlobalContext";

const Home = () => {
  // Make sure useGlobalContext() is being called correctly
  const context = useGlobalContext();

  const { coaster, loading, error } = context;

  if (loading)
    return (
      <div className="text-center font-luckiest py-8">Finisco il giro...</div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest  py-8 text-red-500">
        {error}
      </div>
    );

  // Add a safety check for coaster
  const coasterList = coaster || [];

  return (
    <div>
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Lista Coasters
      </h1>

      {coasterList.length === 0 ? (
        <p className="text-center">Nessun coaster trovato.</p>
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
                <button className="bg-orange-500 text-black font-luckiest px-3 py-1 rounded hover:bg-orange-700">
                  Vedi dettagli
                </button>
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
