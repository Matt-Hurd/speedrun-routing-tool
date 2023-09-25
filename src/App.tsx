import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RunMosaic from "./components/RunMosaic/RunMosaic";
import RouteSelection from "./components/RouteSelection/RouteSelection";
import { Provider } from "react-redux";
import { store } from "./store";
import OverlayDisplay from "./components/OverlayDisplay/OverlayDisplay";

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/route/gh/:user/:repo/:path" element={<RunMosaic />} />
        <Route path="/route/:routeUrl" element={<RunMosaic />} />
        <Route path="/uploaded" element={<RunMosaic />} />
        <Route path="/overlay" element={<OverlayDisplay />} />
        <Route path="/" element={<RouteSelection />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
