import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const ComparisonPage = () => {
  const {
    coaster,
    loading,
    error,
    comparisonList,
    removeFromComparison,
    clearComparison,
  } = useGlobalContext();

  const [comparisonCoasters, setComparisonCoasters] = useState([]);

  useEffect(() => {
    if (coaster && coaster.lenght > 0) {
      const coastersToCompare = coaster.filter((coaster) =>
        comparisonList.includes(String(coaster.id))
      );
      setComparisonCoasters(coastersToCompare);
    } else {
      setComparisonCoasters([]);
    }
  }, [coaster, comparisonList]);

  //prendo tutte le proprietà dei coasters
  const getAllProperties = () => {
    const properties = new Set();
    comparisonCoasters.forEach((coaster) => {
      Object.keys(coster).forEach((key) => {
        if (!["id", "createdAt", "updatedAt", "img"].includes(key)) {
          properties.add(key);
        }
      });
    });
    return Array.from(properties);
  };

  const properties = getAllProperties();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-luckiest mb-6 text-center">
        Confronta Coasters
      </h1>

      {comparisonCoasters.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-luckiest text-xl mb-4">
            Non hai ancora aggiunto coaster da confrontare!
          </p>
          <Link
            to="/"
            className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded hover:bg-orange-700 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1"
          >
            Torna alla lista
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="font-luckiest">
              Confronto di {comparisonCoasters.length} coaster
            </p>
            <button
              onClick={clearComparison}
              className="bg-red-500 text-white font-luckiest px-3 py-1 rounded hover:bg-red-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-red-600 active:translate-y-1"
            >
              Cancella confronto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-r border-gray-200 bg-gray-100 text-left font-luckiest">
                    Proprietà
                  </th>
                  {comparisonCoasters.map((item) => (
                    <th
                      key={item.id}
                      className="py-2 px-4 border-b border-r border-gray-200 bg-gray-100"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-full mb-2">
                          {item.img ? (
                            <img
                              src={`/src/assets/${item.img}`}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/200x100/gray/white?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                Nessuna immagine
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-luckiest text-lg">{item.title}</h3>
                        <div className="flex mt-2">
                          <Link
                            to={`/rollercoaster/${item.id}`}
                            className="bg-orange-500 text-black font-luckiest text-xs px-2 py-1 rounded hover:bg-orange-700 mr-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-orange-600 active:translate-y-1"
                          >
                            Dettagli
                          </Link>
                          <button
                            onClick={() => removeFromComparison(item.id)}
                            className="bg-red-500 text-white font-luckiest text-xs px-2 py-1 rounded hover:bg-red-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-red-600 active:translate-y-1"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-r border-gray-200 font-medium capitalize">
                      {property}
                    </td>
                    {comparisonCoasters.map((item) => (
                      <td
                        key={`${item.id}-${property}`}
                        className="py-2 px-4 border-b border-r border-gray-200 text-center"
                      >
                        {item[property] !== undefined ? (
                          typeof item[property] === "boolean" ? (
                            item[property] ? (
                              "Sì"
                            ) : (
                              "No"
                            )
                          ) : (
                            item[property]
                          )
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonPage;
