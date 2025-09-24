// App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import WordGame from "./WordGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/WordGame" element={<WordGame key="word-game" />} />
      </Routes>
    </Router>
  );
}

export default App;
