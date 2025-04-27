import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IntroModule from "./pages/IntroModule";
import UtilitarianismModule from "./pages/UtilitarianismModule";
import HomeworkPage from "./pages/HomeworkPage";
import { HomeworkProvider } from "./contexts/homeworkContext";
import NavBar from "./components/NavBar";
import HomeworkAdminPage from "./pages/HomeworkAdminPage";


function App() {
  return (
    <HomeworkProvider> {/* Wrap the whole app in HomeworkProvider for now */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules/intro" element={<IntroModule />} />
          <Route path="/modules/utilitarianism" element={<UtilitarianismModule />} />
          <Route path="/admin/homework" element={<HomeworkAdminPage />} />
          <Route path="/homework/:slug" element={<HomeworkPage />} />
        </Routes>
      </Router>
    </HomeworkProvider>
  );
}

export default App;
