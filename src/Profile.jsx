import { useState, useEffect } from "react";
import "./footer.css";
import "./profile.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Profile() {
  const [games, setGames] = useState([]);

  // 🔄 Load games from localStorage + listen for updates
  useEffect(() => {
    const loadGames = () => {
      const stored = localStorage.getItem("games");
      setGames(stored ? JSON.parse(stored) : []);
    };

    loadGames();
    window.addEventListener("gamesUpdated", loadGames);
    return () => window.removeEventListener("gamesUpdated", loadGames);
  }, []);

  // ⭐ Update rating function
  const handleRating = (gameIndex, newRating) => {
    setGames((prevGames) => {
      const updated = prevGames.map((game, index) =>
        index === gameIndex ? { ...game, rating: newRating } : game
      );
      localStorage.setItem("games", JSON.stringify(updated));
      return updated;
    });
  };

  // ⭐ Render stars dynamically
  const renderStars = (rating, gameIndex) => (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          onClick={() => handleRating(gameIndex, i + 1)}
          style={{
            cursor: "pointer",
            color: i < rating ? "#ff009be6" : "#555",
            fontSize: "18px",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      ))}
    </>
  );

  // ⭐ Remove game
  const handleRemoveGame = (gameIndex) => {
    setGames((prevGames) => {
      const updated = prevGames.filter((_, index) => index !== gameIndex);
      localStorage.setItem("games", JSON.stringify(updated));
      window.dispatchEvent(new Event("gamesUpdated"));
      return updated;
    });
  };

  // ⭐ Play Wordle and close modal
  const handlePlay = (gameTitle) => {
    let fullPath = '';
    
    if (gameTitle === "Wordle") {
      fullPath = `${window.location.origin}/react-online-games-website/#/WordGame`; 
    }
    else if(gameTitle === "Tic Tac Toe"){
      fullPath = `${window.location.origin}/react-online-games-website/#/TicTacToe`; 
    }

    window.open(fullPath, "_blank");
    window.close();
  };

  return (
    <div
      className="modal fade"
      id="profileModal"
      tabIndex="-1"
      aria-labelledby="profileModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="profileModalLabel">
              Your Game Library
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {games.length === 0 ? (
              <p className="text-center text-white-50 fs-5">
                You haven't added any games yet.
              </p>
            ) : (
              <>
                <p className="description text-white-50 text-center mb-3 fs-5">
                  Here's a list of all the games you've added to your account.
                </p>

                {games.map((game, index) => (
                  <div
                    key={index}
                    className="cart mb-4 d-flex align-items-center justify-content-between gap-3"
                  >
                    <img className="img-fluid" src={game.img} alt={game.title} />
                    <div className="flex-grow-1">
                      <h4 className="mb-1 fw-bold">{game.title}</h4>
                      <p className="mb-1">Genre: {game.genre}</p>
                      <p className="mb-1">Progress: {game.progress}% Completed</p>
                      <p className="mb-1">Rating: {renderStars(game.rating, index)}</p>
                      <div className="progress mb-1" style={{ height: "10px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${game.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn"
                        onClick={() => handlePlay(game.title)}
                      >
                        Play
                      </button>

                      <button
                        className="btn mt-2"
                        onClick={() => handleRemoveGame(index,game.title)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;