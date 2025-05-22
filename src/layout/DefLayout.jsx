import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Componente Layout
 * Definisce la struttura principale dell'applicazione con header, main content e footer
 * Utilizzato come wrapper per tutte le pagine dell'applicazione
 */
export const Layout = ({ children }) => {
  // Estraggo la lista di confronto dal contesto globale per mostrare il badge
  const { comparisonList } = useGlobalContext();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header con navigazione principale */}
      <header className="bg-orange-500 text-black shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo e link alla home */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img
                src="/coastercomparelogo.png"
                alt="Coaster Compare Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Menu di navigazione principale */}
          <nav>
            <ul className="flex space-x-6">
              {/* Link alla home */}
              <li>
                <Link to="/" className="hover:text-blue-200 font-luckiest">
                  Home
                </Link>
              </li>

              {/* Link alla lista dei coaster */}
              <li>
                <Link
                  to="/coasters"
                  className="hover:text-blue-200 font-luckiest"
                >
                  Coasters
                </Link>
              </li>

              {/* Link alla pagina di confronto con badge numerico */}
              <li>
                <Link
                  to="/compare"
                  className="hover:text-blue-200 font-luckiest relative"
                >
                  Confronta
                  {/* Badge che mostra il numero di coaster nella lista di confronto */}
                  {comparisonList.length > 0 && (
                    <span className="absolute -top-3 right-0 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {comparisonList.length}
                    </span>
                  )}
                </Link>
              </li>

              {/* Link alla pagina dei preferiti */}
              <li>
                <Link
                  to="/favorites"
                  className="hover:text-blue-200 font-luckiest"
                >
                  Preferiti
                </Link>
              </li>

              {/* Link alla pagina di gestione (admin) */}
              <li>
                <Link
                  to="/manage"
                  className="hover:text-blue-200 font-luckiest"
                >
                  Gestisci
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenuto principale della pagina */}
      <main className="flex-grow">{children}</main>

      {/* Footer con copyright */}
      <footer className="bg-orange-500 text-black py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Coaster Compare - Tutti i diritti
            riservati
          </p>
        </div>
      </footer>
    </div>
  );
};
