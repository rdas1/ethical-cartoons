import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IntroModule from "./pages/IntroModule";

function App() {
  return (
    <Router basename="/ethical-cartoons/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/intro" element={<IntroModule />} />
      </Routes>
    </Router>
  );
}

export default App;
