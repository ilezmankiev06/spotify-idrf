import React from "react";

const NavBarBody: React.FC = () => {
  return (
    <div className="col-10">
      <div>
        <div>
          <nav className="navbar navbar-laft navbar-custom ">
            <div className="d-flex justify-content">
              <p>
                <a href="javascript:history.go(-1)">
                  <i className="fas fa-chevron-left" style={{ width: "3rem" }}></i>
                </a>
              </p>
              <p>
                <a href="javascript:history.go(+1)">
                  <i className="fas fa-chevron-right" style={{ width: "3rem" }}></i>
                </a>
              </p>
            </div>
          </nav>
        </div>

        <nav className="navbar navbar-laft navbar-custom">
          <div className="d-flex justify-content">
            <p>
              <a href="javascript:history.go(-1)">
                <i className="fas fa-chevron-left" style={{ width: "3rem" }}></i>
              </a>
            </p>
            <p>
              <a href="javascript:history.go(+1)">
                <i className="fas fa-chevron-right" style={{ width: "3rem" }}></i>
              </a>
            </p>
            <div className="container-fluid">
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Artites, titres ou albums"
                  aria-label="Search"
                  style={{ width: "30rem" }}
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>

        <nav className="navbar navbar-laft navbar-custom">
          <div className="d-flex justify-content">
            <p>
              <a href="javascript:history.go(-1)">
                <i className="fas fa-chevron-left" style={{ width: "3rem" }}></i>
              </a>
            </p>
            <p>
              <a href="javascript:history.go(+1)">
                <i className="fas fa-chevron-right" style={{ width: "3rem" }}></i>
              </a>
            </p>
            <button className="boutton btn btn-outline-success" type="submit" style={{ width: "5rem" }}>
              Playlists
            </button>
            <button className="boutton btn btn-outline-success" type="submit" style={{ width: "5rem" }}>
              Artistes
            </button>
            <button className="boutton btn btn-outline-success" type="submit" style={{ width: "5rem" }}>
              Albums
            </button>
          </div>
        </nav>
      </div>

      <div>Body de notre body</div>
    </div>
  );
};

export default NavBarBody;
