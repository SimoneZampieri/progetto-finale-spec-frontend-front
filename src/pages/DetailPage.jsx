import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const DetailPage = () => {
  //estraggo id da url
  const { id } = useParams();
  const [coasterDetail, setCoasterDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { coaster, addToComparison, removeFromComparison, isInComparison } =
    useGlobalContext();
  const [favorites, setFavorites] = useState(() => {
    //inizializzo i preferiti da localstorage
    const storedFavorites = localStorage.getItem("favoriteCoasters");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  //funzione che aggiunge/rimuove dai preferiti
  const toggleFavorite = (coasterId) => {
    // converto l'id in stringa
    const idToToggle = String(coasterId);

    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(idToToggle)
        ? prevFavorites.filter((id) => id !== idToToggle)
        : [...prevFavorites, idToToggle];

      //salvo in localstorage
      localStorage.setItem("favoriteCoasters", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  useEffect(() => {
    const fetchCoasterDetail = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/rollercoasters/${id}`);

        if (!response.ok) {
          throw new Error(`Errore nel caricamento: ${response.status}`);
        }

        const data = await response.json();
        console.log("Coaster detail data:", data);
        if (data && data.success && data.rollercoaster) {
          setCoasterDetail(data.rollercoaster);
        } else {
          throw new Error("Dati del coaster non validi");
        }

        setError(null);
      } catch (err) {
        console.error("errore nel caricamento dettagli", err);
        setError("Impossibile caricare i dettagli");
      } finally {
        setLoading(false);
      }
    };

    fetchCoasterDetail();
  }, [id]);

  if (loading)
    return (
      <div className="text-center font-luckiest py-8">
        Caricamento dettagli...
      </div>
    );
  if (error)
    return (
      <div className="text-center font-luckiest py-8 text-red-500">{error}</div>
    );
  if (!coasterDetail)
    return (
      <div className="text-center font-luckiest py-8">
        Nessun dettaglio trovato
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-2 ">
      <div className="md:flex">
        <div className="md:w-1/2">
          {coasterDetail.img ? (
            <>
              <img
                className="h-full w-full object-cover min-h-[400px]"
                src={`/src/assets/${coasterDetail.img}`}
                alt={coasterDetail.title}
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/gray/white?text=No+Image";
                }}
              />
            </>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center min-h-[400px]">
              <span className="text-gray-500">Nessuna immagine</span>
            </div>
          )}
        </div>

        <div className="p-8 md:w-1/2">
          <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">
            {coasterDetail.category}
          </div>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 leading-tight">
            {coasterDetail.title}
          </h1>
          <p className="mt-2 text-gray-600">
            {coasterDetail.park}, {coasterDetail.state}
          </p>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Anno di apertura
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.openingYear}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Produttore
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.maker}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Altezza</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.height} m
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lunghezza</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.length} m
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Inversioni
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.inversions}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Velocità</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.speed} km/h
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Tipo di sollevamento
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {coasterDetail.lift}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Descrizione</h3>
            <p className="mt-2 text-gray-600">{coasterDetail.description}</p>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              className={`${
                isInComparison(coasterDetail.id)
                  ? "bg-green-700"
                  : "bg-green-500"
              } text-white px-4 py-2 rounded hover:bg-green-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-green-600 active:translate-y-1 my-3`}
              onClick={() =>
                isInComparison(coasterDetail.id)
                  ? removeFromComparison(coasterDetail.id)
                  : addToComparison(coasterDetail.id)
              }
            >
              {isInComparison(coasterDetail.id)
                ? "Rimuovi dal confronto"
                : "Aggiungi al confronto"}
            </button>
            <button
              className={`${
                favorites.includes(String(id))
                  ? "bg-purple-700"
                  : "bg-purple-500"
              } text-white px-4 py-2 rounded hover:bg-purple-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-purple-600 active:translate-y-1 my-3 flex items-center`}
              onClick={() => toggleFavorite(id)}
            >
              {favorites.includes(String(id))
                ? "Rimuovi dai preferiti"
                : "Aggiungi ai preferiti"}
              {favorites.includes(String(id)) && (
                <span className="ml-1">★</span>
              )}
            </button>
            <Link
              to="/coasters"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:bg-gray-600 active:translate-y-1 my-3"
            >
              Torna alla lista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
