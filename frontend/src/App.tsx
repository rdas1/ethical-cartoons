import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IntroModule from "./pages/IntroModule";
import UtilitarianismModule from "./pages/UtilitarianismModule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/intro" element={<IntroModule />} />
        <Route path="/modules/utilitarian" element={<UtilitarianismModule />} />
      </Routes>
    </Router>
  );
}

export default App;
