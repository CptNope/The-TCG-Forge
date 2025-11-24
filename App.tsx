import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingScreen from './screens/LandingScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import CardSetsGridScreen from './screens/CardSetsGridScreen';
import CardSetsListScreen from './screens/CardSetsListScreen';
import CardEditorScreen from './screens/CardEditorScreen';
import PackDesignerScreen from './screens/PackDesignerScreen';
import AttributesScreen from './screens/AttributesScreen';

// Scroll to top wrapper
const ScrollToTop: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/projects" element={<ProjectsScreen />} />
          <Route path="/sets-grid" element={<CardSetsGridScreen />} />
          <Route path="/sets-list" element={<CardSetsListScreen />} />
          <Route path="/card-editor" element={<CardEditorScreen />} />
          <Route path="/pack-designer" element={<PackDesignerScreen />} />
          <Route path="/attributes" element={<AttributesScreen />} />
        </Routes>
      </ScrollToTop>
    </HashRouter>
  );
};

export default App;