// App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import WordGame from "./games/WordGame";
import TicTacToe from "./games/TicTacToe";

// ⚡️ Import your future game components
// (you can replace placeholders with actual game components later)
import ClassicTicTacToe from "./games/ClassicTicTacToe";
import ReverseXO from "./games/ReverseXO";
import Sus from "./games/Sus";
import FiveByFive from "./games/FiveByFive";
import PyramidTicTacToe from "./games/PyramidTicTacToe";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Home & Main */}
        <Route path="/" element={<Home />} />
        <Route path="/WordGame" element={<WordGame key="word-game" />} />
        <Route path="/TicTacToe" element={<TicTacToe key="Tic-Tac-Toe" />} />

        {/* 🎮 Sub-games inside Tic Tac Toe section */}
        <Route path="/ClassicTicTacToe" element={<ClassicTicTacToe />} />
        <Route path="/ReverseXO" element={<ReverseXO />} />
        <Route path="/Sus" element={<Sus />} />
        <Route path="/FiveByFive" element={<FiveByFive />} />
        <Route path="/PyramidTicTacToe" element={<PyramidTicTacToe />} />
      </Routes>
    </Router>
  );
}

export default App;
