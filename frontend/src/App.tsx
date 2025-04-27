import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IntroModule from "./pages/IntroModule";
import UtilitarianismModule from "./pages/UtilitarianismModule";
import HomeworkPage from "./pages/HomeworkPage";
import { HomeworkProvider } from "./contexts/homeworkContext";
import { EducatorProvider } from "./contexts/educatorContext";
import NavBar from "./components/NavBar";
import EducatorLoginPage from "@/pages/EducatorLoginPage";
import EducatorDashboardPage from "@/pages/EducatorDashboardPage";
import EducatorVerifyPage from "./pages/EducatorVerifyPage";
import {Toaster} from 'sonner'


function App() {
  return (
    <HomeworkProvider> {/* Wrap the whole app in HomeworkProvider for now */}
      <EducatorProvider>
          <Router>
            <Toaster />
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modules/intro" element={<IntroModule />} />
              <Route path="/modules/utilitarianism" element={<UtilitarianismModule />} />
              <Route path="/homework/:slug" element={<HomeworkPage />} />
              <Route path="/educators/login" element={<EducatorLoginPage />} />
              <Route path="/educators/verify" element={<EducatorVerifyPage />} />
              <Route path="/educators/dashboard" element={<EducatorDashboardPage />} />
            </Routes>
          </Router>
        </EducatorProvider>
    </HomeworkProvider>
  );
}

export default App;
