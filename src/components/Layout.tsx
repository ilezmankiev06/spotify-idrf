import React from "react";
import Head from "next/head";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
};

const NavBar: React.FC<Props> = ({ isLoggedIn, spotifyLoginUrl }) => {
  return (
    <div className="all-sidebar">
      <nav className="sidebar navbar-expand-lg navbar-custom">
        <div className="container">
          <a className="title" href="/">
            <h2 className="white" style={{ color: "white" }}>
              <br />
              <i className="fab fa-spotify"></i>Spotify
            </h2>
          </a>
          <br />
          <p>
            <a className="accueil" href="/">
              <i className="fas fa-home"></i> Accueil
            </a>
          </p>
          <p>
            <a className="recherche" href="/search">
              <i className="fas fa-search"></i> Rechercher
            </a>
          </p>
          <p>
            <a className="bibliotheque" href="/collection/playlists">
              <i className="fas fa-list"></i> Bibliothèque
            </a>
          </p>
          <br />
          <div style={{ borderTop: "1px solid grey ", marginLeft: 5, marginRight: 20 }}></div>
          <br />
          {isLoggedIn ? (
            <>
              <p>
                <a className="login" href="/api/logout">
                  Logout
                </a>
              </p>
            </>
          ) : (
            <p>
              <a className="login" href={spotifyLoginUrl}>
                Login
              </a>
            </p>
          )}
        </div>
      </nav>
      <style jsx>
        {`
          .accueil {
            color: grey;
            font-size: 15px;
          }
          .recherche {
            color: grey;
            font-size: 15px;
          }
          .bibliotheque {
            color: grey;
            font-size: 15px;
          }
          .login {
            font-size: 15px;
          }
          .accueil:hover {
            color: white;
          }
          .recherche:hover {
            color: white;
          }
          .bibliotheque:hover {
            color: white;
          }
          .title:hover {
            text-decoration: none;
          }
          .title {
            text-decoration: none;
          }
          .accueil:hover {
            text-decoration: none;
          }
          .accueil {
            text-decoration: none;
          }
          .recherche:hover {
            text-decoration: none;
          }
          .recherche {
            text-decoration: none;
          }
          .bibliotheque:hover {
            text-decoration: none;
          }
          .bibliotheque {
            text-decoration: none;
          }
          .login:hover {
            text-decoration: none;
          }
          .login {
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );
};

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
      <NavBar isLoggedIn={isLoggedIn} spotifyLoginUrl={spotifyLoginUrl} />
      <main>{children}</main>
    </>
  );
};
