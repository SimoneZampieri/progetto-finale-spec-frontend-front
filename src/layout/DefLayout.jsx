import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

export const Layout = ({ children }) => {
  const { comparisonList } = useGlobalContext();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-orange-500 text-black shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/coastercomparelogo.png"
              alt="Coaster Compare Logo"
              className="h-12 w-auto"
            />
            <div className="text-xl font-bold"></div>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-200 font-luckiest">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="hover:text-blue-200 font-luckiest relative"
                >
                  Confronta
                  {comparisonList.length > 0 && (
                    <span className="absolute -top-3 right-0 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {comparisonList.length}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="hover:text-blue-200 font-luckiest"
                >
                  Preferiti
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>

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
