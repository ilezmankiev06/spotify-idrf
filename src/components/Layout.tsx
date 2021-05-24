import React from "react";
import Head from "next/head";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
};

const NavBar: React.FC<Props> = ({ isLoggedIn, spotifyLoginUrl }) => {
  return (
    <div>
      {/* // <nav>
    //   <p>
    //     <a href="/">home</a>
    //   </p> */}
      {/* {isLoggedIn ? (
        <>
          <p>
            <a href="/api/logout">logout</a>
          </p>
        </>
      ) : (
        <p>
          <a href={spotifyLoginUrl}>login</a>
        </p>
      )} */}
      <nav className="sidebar navbar-expand-lg navbar-custom">
        <div className="container">
          <a href="/">
            <h1>
              <i className="fab fa-spotify"></i>Spotify
            </h1>
          </a>
          <br />
          <p>
            <a href="/">
              <i className="fas fa-home"></i>Accueil
            </a>
          </p>
          <p>
            <a href="/search">
              <i className="fas fa-search"></i>Rechercher
            </a>
          </p>
          <p>
            <a href="/collection/playlists">
              <i className="fas fa-list"></i>Bibliothèque
            </a>
          </p>
          {isLoggedIn ? (
            <>
              <p>
                <a href="/api/logout">logout</a>
              </p>
            </>
          ) : (
            <p>
              <a href={spotifyLoginUrl}>login</a>
            </p>
          )}
        </div>
      </nav>
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
