import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles.css";
import "../games.css";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import useProgress from "./progress.jsx";

import ticTacToeImg from "../assets/tic tac toe.png";
import reversxoImg from "../assets/xo.png";
import susImg from "../assets/sus.jpg";
import _5x5Img from "../assets/5x5.png"; 
import pyramidImg from "../assets/pyramid tic tac toe.jpg"; 

// 🎮 Default games list
let gamesList = [
  { img: ticTacToeImg, title: "Tic Tac Toe", desc: "Classic X vs O strategy game", path: "/ClassicTicTacToe", win: false },
  { img: reversxoImg, title: "XO Special", desc: "Reverse X and O variant", path: "/ReverseXO", win: false },
  { img: pyramidImg, title: "Pyramid Tic Tac Toe", desc: "Unique pyramid layout", path: "/PyramidTicTacToe", win: false },
  { img: susImg, title: "Sus", desc: "Fun imposter mini game", path: "/Sus", win: false },
  { img: _5x5Img, title: "5x5 Grid", desc: "Bigger tic tac toe challenge", path: "/FiveByFive", win: false },
];

// Save to localStorage only if not already saved
if (!localStorage.getItem("gamesList")) {
  localStorage.setItem("gamesList", JSON.stringify(gamesList));
}

// ✅ Reset all wins to false
function resetGames() {
  let games = JSON.parse(localStorage.getItem("gamesList")) || [];
  games = games.map((g) => ({ ...g, win: false })); 
  localStorage.setItem("gamesList", JSON.stringify(games));
  window.location.reload(); // 🔄 refresh to update progress & lock games
}

// 🎮 Reusable Card Component
function GameCard({ img, title, desc, path, locked }) {
  const navigate = useNavigate();

  const handlePlay = () => {
    if (!locked) {
      navigate(path);
    }
  };

  return (
    <div className="col-4 col-sm-4 col-md-3 col-lg-2 mb-3 mt-2 games">
      <div className={`box tic card ${locked ? "locked" : ""}`}>
        <img src={img} className="img-fluid" alt={title} />
        <div className="overlay">
          <p>
            {title} - {desc}
          </p>
          <button
            onClick={handlePlay}
            className="btn-link"
            disabled={locked}
          >
            {locked ? "Locked 🔒" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TicTacToe() {
  const navigate = useNavigate();
  const [progress] = useProgress();

  // ✅ Reload games from localStorage each render
  const games = JSON.parse(localStorage.getItem("gamesList")) || gamesList;

  return (
    <div id="games" className="games text-center pt-4 pb-4">
      <div className="tic-container container">
        <div className="main-title mt-3 mb-4 position-relative">
          <h2>Test the different tic tac toe game boards!</h2>
          <p className="text-white-50 fst-italic">
            in each game you have easy and hard levels, you will unlock the next games when you win the easy mode in the previous ones 
            <br/>Progress: {progress}% – Unlock games by winning!
          </p>
        </div>

        <div className="row d-flex justify-content-center">
          {games.map((game, index) => {
            const unlockThreshold = (index / games.length) * 100;
            const locked = progress < unlockThreshold;

            return <GameCard key={index} {...game} locked={locked} />;
          })}
        </div>
      </div>
      <button className="gamesB" onClick={() => navigate("/")}>
        Leave
      </button>      
      
      {/* ✅ FIXED: don’t call resetGames(), just pass the function */}
      <button className="gamesB" onClick={resetGames}>
        Reset
      </button>
    </div>
  );
}

export default TicTacToe;
