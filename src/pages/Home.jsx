import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Componente Home
 * Pagina principale dell'applicazione che mostra una panoramica delle funzionalità
 * e alcuni coaster in evidenza selezionati casualmente
 */
const Home = () => {
  // Estraggo i dati dei coaster dal contesto globale
  const { coaster } = useGlobalContext();

  /**
   * Seleziona casualmente fino a 3 coaster da mostrare in evidenza
   */
  const getFeaturedCoasters = () => {
    // Se non ci sono coaster disponibili, ritorna un array vuoto
    if (!coaster || coaster.length === 0) return [];

    // Crea una copia dell'array e la mescola in modo casuale
    const shuffled = [...coaster].sort(() => 0.5 - Math.random());
    // Prende i primi 3 elementi (o meno se non ce ne sono abbastanza)
    return shuffled.slice(0, Math.min(3, shuffled.length));
  };

  // Ottiene i coaster da mostrare in evidenza
  const featuredCoasters = getFeaturedCoasters();

  return (
    <div className="min-h-screen">
      {/* Hero section con video di sfondo */}
      <section className="relative h-[70vh] bg-gradient-to-r from-orange-600 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Video di sfondo con fallback */}
          <video
            className="absolute w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videobackground.mp4" type="video/mp4" />
            Il tuo browser non supporta il tag video!
          </video>
          {/* Overlay gradiente per migliorare la leggibilità del testo */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-orange-400/70 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Contenuto principale della hero section */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <div className="flex justify-center mb-6">
              <img
                src="/coastercomparelogo.png"
                alt="Coaster Compare Logo"
                className="h-60 w-auto drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
              />
            </div>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Confronta le montagne russe più emozionanti del mondo e scopri
              quale ti farà battere il cuore più forte!
            </p>
            {/* Pulsanti di call-to-action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/coasters"
                className="bg-orange-500 text-black font-luckiest px-6 py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
              >
                Esplora Coasters
              </Link>
              <Link
                to="/compare"
                className="bg-purple-600 text-white font-luckiest px-6 py-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
              >
                Confronta Ora
              </Link>
            </div>
          </div>
        </div>
        {/* Sfumatura di transizione verso la sezione successiva */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Sezione "Come Funziona" con i tre passaggi principali */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-luckiest text-center mb-12">
            Come Funziona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primo passaggio: Esplora */}
            <div className="bg-orange-100 p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-luckiest mb-3">Esplora</h3>
              <p>
                Sfoglia la nostra collezione di montagne russe da tutto il
                mondo, filtra per categoria e trova le tue preferite.
              </p>
            </div>

            {/* Secondo passaggio: Confronta */}
            <div className="bg-orange-100 p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-luckiest mb-3">Confronta</h3>
              <p>
                Seleziona due o più coaster e confronta altezza, velocità,
                lunghezza e altre caratteristiche fianco a fianco.
              </p>
            </div>

            {/* Terzo passaggio: Salva */}
            <div className="bg-orange-100 p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-luckiest mb-3">Salva</h3>
              <p>
                Aggiungi le tue montagne russe preferite ai preferiti per
                ritrovarle facilmente in futuro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione coaster in evidenza (mostrata solo se ci sono coaster disponibili) */}
      {featuredCoasters.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-luckiest text-center mb-12">
              Coaster in Evidenza
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mappa i coaster in evidenza selezionati casualmente */}
              {featuredCoasters.map((coaster) => (
                <div
                  key={coaster.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105"
                >
                  {/* Sezione immagine */}
                  <div className="h-48 overflow-hidden">
                    {coaster.img ? (
                      <img
                        src={
                          coaster.img
                            ? `/src/assets/${coaster.img}`
                            : "https://placehold.co/400x200/gray/white?text=No+Image"
                        }
                        alt={coaster.title}
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

                  {/* Informazioni sul coaster */}
                  <div className="p-6">
                    <h3 className="text-xl font-luckiest mb-2">
                      {coaster.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{coaster.category}</p>
                    <Link
                      to={`/rollercoaster/${coaster.id}`}
                      className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded inline-block hover:bg-orange-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
                    >
                      Scopri di più
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pulsante per vedere tutti i coaster */}
            <div className="text-center mt-10">
              <Link
                to="/coasters"
                className="bg-orange-500 text-black font-luckiest px-6 py-3 rounded-lg hover:bg-orange-600 inline-block drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
              >
                Vedi tutti i coaster
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sezione finale di call-to-action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-luckiest mb-6">
            Pronto per l'adrenalina?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Inizia a confrontare le montagne russe più emozionanti e trova la
            tua prossima avventura!
          </p>
          <Link
            to="/coasters"
            className="bg-white text-orange-600 font-luckiest px-6 py-3 rounded-lg hover:bg-gray-100 inline-block drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
          >
            Inizia ora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
