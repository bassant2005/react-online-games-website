import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles.css";
import "../games.css";
import "./tictactoe.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProgress from "./XOprogress";

import ticTacToeImg from "../assets/tic tac toe.png";
import reversxoImg from "../assets/xo.png";
import susImg from "../assets/sus.jpg";
import _5x5Img from "../assets/5x5.png"; 
import pyramidImg from "../assets/pyramid tic tac toe.jpg"; 

// 🎮 Game data arrays (unique + updated images + routes)
const gamesList = [
  { img: ticTacToeImg, title: "Tic Tac Toe", desc: "Classic X vs O strategy game", path: "/ClassicTicTacToe" },
  { img: reversxoImg, title: "XO Special", desc: "Reverse X and O variant", path: "/ReverseXO" },
  { img: pyramidImg, title: "Pyramid Tic Tac Toe", desc: "Unique pyramid layout", path: "/PyramidTicTacToe" },
  { img: susImg, title: "Among Sus", desc: "Fun imposter mini game", path: "/AmongSus" },
  { img: _5x5Img, title: "5x5 Grid", desc: "Bigger tic tac toe challenge", path: "/FiveByFive" },
];

// 🎮 Reusable Card Component
function GameCard({ img, title, desc, path, locked }) {
  const navigate = useNavigate();

  const handlePlay = () => {
    if (!locked) {
      navigate(path); // 🚀 Navigate to game route
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

  return (
    <div id="games" className="games text-center pt-4 pb-4">
      <div className="tic-container container">
        <div className="main-title mt-3 mb-4 position-relative">
          <h2>Test the different tic tac toe game boards!</h2>
          <p className="text-white-50 fst-italic">
            Progress: {progress}% – Unlock games by winning!
          </p>
        </div>

        <div className="row d-flex justify-content-center">
          {gamesList.map((game, index) => {
            const unlockThreshold = (index / gamesList.length) * 100;
            const locked = progress < unlockThreshold;

            return <GameCard key={index} {...game} locked={locked} />;
          })}
        </div>
      </div>
      <button className="gamesB" onClick={() => navigate("/")}>
        Leave
      </button>
    </div>
  );
}

export default TicTacToe;
