import { Link } from "react-router-dom";

export const Layout = ({ children }) => {
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
                <Link to="/" className="hover:text-blue-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-blue-200">
                  Confronta
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-blue-200">
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
