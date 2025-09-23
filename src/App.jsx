import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WordGame from "./WordGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/WordGame" element={<WordGame />} />
    </Routes>
  );
}

export default App;
