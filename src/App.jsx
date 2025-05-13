import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/DefLayout";
import { GlobalProvider } from "./context/GlobalContext";
import Home from "./pages/Home";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparisonPage from "./pages/ComparisonPage";
import CoasterList from "./pages/CoasterList";
import ManageCoasters from "./pages/ManageCoasters";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coasters" element={<CoasterList />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/rollercoaster/:id" element={<DetailPage />} />
            <Route path="/manage" element={<ManageCoasters />} />
            <Route path="*" element={<div> Pagina non trovata </div>} />
          </Routes>
        </Layout>
      </Router>
    </GlobalProvider>
  );
}

export default App;
