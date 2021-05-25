import React from "react";
import Head from "next/head";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
};

const NavBarBody: React.FC<Props> = ({ isLoggedIn, spotifyLoginUrl }) => {
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
            {isLoggedIn ? (
              <>
                <p>
                  <a className="login" href="/api/logout">
                    logout
                  </a>
                </p>
              </>
            ) : (
              <p>
                <a className="login" href={spotifyLoginUrl}>
                  login
                </a>
              </p>
            )}
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

export const Layout: React.FC<Props> = ({ children, isLoggedIn, spotifyLoginUrl }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://kit.fontawesome.com/476c89e3e9.js" crossOrigin="anonymous"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
        <script src="https://kit.fontawesome.com/476c89e3e9.js" crossOrigin="anonymous"></script>
      </Head>
      <NavBarBody isLoggedIn={isLoggedIn} spotifyLoginUrl={spotifyLoginUrl} />
      <main>{children}</main>
    </>
  );
};
