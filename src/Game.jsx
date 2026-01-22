import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
import React from "react";

function Game({ game, modalId }) {
  if (!game) return null; // safety

  // 🎮 Detailed descriptions for your games
  const gameDescriptions = {
    "Tic Tac Toe":
      "A several grid games where two players take turns marking X or O. The goal is to get the target in a row horizontally, vertically, or diagonally.",
    "Wordle":
      "Guess the hidden word within limited tries! After each guess, letters change color to show if they’re correct and in the right spot.",
    "Hangman":
      "Guess the word letter by letter before the stick figure is completed. Every wrong guess adds a part to the gallows!",
    "Sudoku":
      "A number-placement puzzle played on a 9x9 grid. Fill the grid so that every row, column, and 3x3 box contains the digits 1 through 9 exactly once.",
    "Connect Four":
      "Two-player connection game where players take turns dropping discs into a vertical 7x6 grid. The first to connect four discs in a row wins.",
    "Memory Match":
      "A card-matching game where all cards are laid face down. Players flip two cards at a time, trying to find matching pairs using memory.",

    // 🎮 New ones
    "XO Special":
      "A reverse version of X and O where the strategy flips — avoid making three in a row!",
    "Among Sus":
      "A fun imposter-themed mini game inspired by tic tac toe where you have to make the word 'sus' in any diraction to win.",
    "5x5 Grid":
      "A bigger tic tac toe challenge with more rows and columns to strategize.",
    "Pyramid Tic Tac Toe":
      "A unique pyramid-shaped tic tac toe variant that adds a new twist to the gameplay."
  };

  const handleAdd = () => {
    const stored = JSON.parse(localStorage.getItem("games")) || [];
    
    // check if already exists (by title)
    const exists = stored.some((g) => g.title === game.title);
    if (!exists) {
      const newGame = {
        img: game.img,
        title: game.title,
        genre: "Puzzle",
        progress: 0,
        rating: 0,
      };

      stored.push(newGame);
      localStorage.setItem("games", JSON.stringify(stored));
    }
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>
              {game.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body text-center d-flex">
            <div>
              <img
                src={game.img}
                alt={game.title}
                className="img-fluid rounded me-5"
              />
            </div>

            <div>
              <p className="fs-5">{game.desc}</p>
              <p className="text-white-50 fs-4 fst-italic">
                🎮 More details :<br />
                {gameDescriptions[game.title]}
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="btn btn-primary"
              onClick={handleAdd}
            >
              Add to my list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
