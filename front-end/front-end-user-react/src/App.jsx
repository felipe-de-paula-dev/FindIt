import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { Index } from "./pages/Index";
import { RetirarItem } from "./pages/RetirarItem";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Map" element={<RetirarItem />} />
      </Routes>
    </Router>
  );
}

export default App;
