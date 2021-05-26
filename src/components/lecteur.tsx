import React from "react";

const Lecteur: React.FC = () => {
  return (
    <div className="body d-flex justify-content">
      <div className="titre" style={{ width: "15rem" }}>
        <h1>Titre</h1>
      </div>
      <div className="milieu" style={{ width: "60rem" }}>
        <div className="text-center bg-dark" style={{ height: "5.5rem" }}>
          <div className="media-controls">
            <br />
            <div className="media-buttons d-flex justify-content-evenly">
              <br />
              <button className="back-button media-button">
                <i className="fas fa-step-backward button-icons"></i>
                <span className="button-text milli">Back</span>
              </button>

              <button className="play-button media-button">
                <i className="fas fa-play button-icons delta"></i>
                <span className="button-text milli">Play</span>
              </button>

              <button className="skip-button media-button">
                <i className="fas fa-step-forward button-icons"></i>
                <span className="button-text milli">Skip</span>
              </button>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1>Volume</h1>
      </div>
      <style>
        {`
        .player {
          position: fixed;
          margin-top: 44rem;
        }
        `}
      </style>
    </div>
  );
};

export default Lecteur;
