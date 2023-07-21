import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RunMosaic from "./components/RunMosaic/RunMosaic";
import RouteSelection from "./components/RouteSelection/RouteSelection";
import { Provider } from "react-redux";
import { store } from "./store";

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/:gameId/:routeId" element={<RunMosaic />} />
        <Route path="/" element={<RouteSelection />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
