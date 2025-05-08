import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/DefLayout";
import { GlobalProvider } from "./context/GlobalContext";
import Home from "./pages/Home";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<div>Pagina di confronto</div>} />
            <Route path="/favorites" element={<div>Pagina Preferiti</div>} />
            <Route path="*" element={<div> Pagina non trovata </div>} />
          </Routes>
        </Layout>
      </Router>
    </GlobalProvider>
  );
}

export default App;
