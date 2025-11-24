import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import LandingScreen from './screens/LandingScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import CardSetsGridScreen from './screens/CardSetsGridScreen';
import CardSetsListScreen from './screens/CardSetsListScreen';
import CardEditorScreen from './screens/CardEditorScreen';
import PackDesignerScreen from './screens/PackDesignerScreen';
import AttributesScreen from './screens/AttributesScreen';
import PackSimulatorScreen from './screens/PackSimulatorScreen';
import BulkEditorScreen from './screens/BulkEditorScreen';
import AttributeSchemaScreen from './screens/AttributeSchemaScreen';

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
    <AppProvider>
      <HashRouter>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/projects" element={<ProjectsScreen />} />
            <Route path="/sets-grid" element={<CardSetsGridScreen />} />
            <Route path="/sets-list" element={<CardSetsListScreen />} />
            <Route path="/card-editor" element={<CardEditorScreen />} />
            <Route path="/pack-designer" element={<PackDesignerScreen />} />
            <Route path="/pack-simulator" element={<PackSimulatorScreen />} />
            <Route path="/attributes" element={<AttributesScreen />} />
            <Route path="/attribute-schema" element={<AttributeSchemaScreen />} />
            <Route path="/bulk-editor" element={<BulkEditorScreen />} />
          </Routes>
        </ScrollToTop>
      </HashRouter>
    </AppProvider>
  );
};

export default App;