// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Header from './components/organisms/Header';
// import CvTemplatesPage from './pages/CvTemplatePage';
// import LandingBuilder from './pages/LandingBuilder';
// import SliderSV from './components/molecules/SliderSV';
import CvTemplate from './pages/CvTemplate';
import StarterPage from './pages/StarterPage';
import { Route, Routes } from 'react-router-dom';
// import SliderSV from './components/molecules/SliderSV';
// import CvTemplate from './pages/CvTemplate';
import Header from './components/organisms/Header';
import LandingBuilder from './pages/LandingBuilder';
import AuthPage from './pages/AuthPage';
// import StarterPage from './pages/StarterPage';
import SectionsManager from './components/organisms/SectionsManager';
import TemplateManager from './components/organisms/TemplateManager';
import IntroPage from './pages/IntroPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StarterPage />} />
      <Route path="/sign-in" element={<AuthPage />} />
      <Route path="/sign-up" element={<AuthPage />} />
      <Route path="/intro" element={<IntroPage />} />
      <Route
        path="/landing-builder"
        element={
          <>
            <Header />
            <LandingBuilder />
          </>
        }
      />
      <Route path="/resume-builder" element={<CvTemplate />} />
      <Route path="landing-builder/sections-creator" element={<SectionsManager />} />
      <Route path="landing-builder/template-creator" element={<TemplateManager />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default App;
