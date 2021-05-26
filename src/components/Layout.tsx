import React from "react";
import Head from "next/head";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
};

export const Layout: React.FC<Props> = ({ children, isLoggedIn, spotifyLoginUrl }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://kit.fontawesome.com/476c89e3e9.js" crossOrigin="anonymous"></script>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
          crossOrigin="anonymous"
        />
        <script src="https://kit.fontawesome.com/476c89e3e9.js" crossOrigin="anonymous"></script>
      </Head>
      <div>
        <nav className="sidebar navbar-expand-lg navbar-custom">
          <div className="container">
            <a className="title" href="/">
              <h1 className="white" style={{ color: "white" }}>
                <i className="fab fa-spotify"></i>Spotify
              </h1>
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
          </div>
        </nav>
        <style jsx>
          {`
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
      <main>{children}</main>
    </>
  );
};
