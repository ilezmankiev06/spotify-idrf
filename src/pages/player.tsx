import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyTrack, SpotifyUser } from "../types/spotify";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

type song = {
  name: string;
  uri: string;
};

type Playlists = {
  track: {
    uri: string;
    name: string;
  };
};

export const play = (accessToken: string, deviceId: string, track: string, nextPrevious: any) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: nextPrevious,
    }),
  });
};

export const pause = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const next = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const previous = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getAlbum = async (accessToken: string, setTargetAlbum: any, setPicturealbum: any, setNextPrevious: any) => {
  return await fetch(`https://api.spotify.com/v1/albums/2noRn2Aes5aoNVsU6iWThc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((result: any) => {
      const tab: any = [];
      const tabSong: any = [];
      setPicturealbum(result.images[1].url);
      result.tracks.items.map((song: song) =>
        tab.push({
          uri: song.uri,
          name: song.name,
        }),
      );
      setTargetAlbum(tab);
      tab.map((toto: any) => {
        return tabSong.push(toto.uri);
      });
      setNextPrevious(tabSong);
    });
};

const getPlaylists = async (accessToken: string, setPlaylist: any, setPicturelist: any, setNextPrevious: any) => {
  return await fetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((play) => {
      const tab: any = [];
      const tabSongPlaylist: any = [];
      setPicturelist(play.items[0].track.album.images[1].url);
      play.items.map((song: Playlists) =>
        tab.push({
          uri: song.track.uri,
          name: song.track.name,
        }),
      );
      setPlaylist(tab);
      tab.map((toto: any) => {
        return tabSongPlaylist.push(toto.uri);
      });
      setNextPrevious(tabSongPlaylist);
    });
};

export const getTrack = async (accessToken: string, setTrack: any, setPicturetrack: any) => {
  return await fetch("https://api.spotify.com/v1/tracks/6nQy5XEEEJKu8FE1FS2Wbt", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((song) => {
      setPicturetrack(song.album.images[1].url);
      setTrack(song.uri);
    });
};

export const Volumes = (accessToken: string, deviceId: string, volume: any) => {
  return fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(true);
  const [currentTrack, setCurrentTrack] = React.useState<any>("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [targetAlbum, setTargetAlbum] = React.useState([]);
  const [track, setTrack] = React.useState("");
  const [playlist, setPlaylist] = React.useState([]);
  const [picturetrack, setPicturetrack] = React.useState("");
  const [picturelist, setPicturelist] = React.useState("");
  const [picturealbum, setPicturealbum] = React.useState("");
  const [volume, setVolume] = React.useState<any>(50);
  const [navAlbum, setNavAlbum] = React.useState(false);
  const [navTrack, setNavTrack] = React.useState(false);
  const [navPlaylist, setNavPlaylist] = React.useState(false);
  const [nextPrevious, setNextPrevious] = React.useState("");

  const reglageVolume = (value: number) => {
    setVolume(volume + value);
    Volumes(accessToken, deviceId, volume);
  };

  const reglageNavAlbum = () => {
    setNavTrack(false);
    setNavAlbum(true);
    setNavPlaylist(false);
    getAlbum(accessToken, setTargetAlbum, setPicturealbum, setNextPrevious);
  };
  const reglageNavTrack = () => {
    setNavTrack(true);
    setNavAlbum(false);
    setNavPlaylist(false);
    getTrack(accessToken, setTrack, setPicturetrack);
  };
  const reglageNavPlaylist = () => {
    setNavTrack(false);
    setNavAlbum(false);
    setNavPlaylist(true);
    getPlaylists(accessToken, setPlaylist, setPicturelist, setNextPrevious);
  };

  React.useEffect(() => {
    const playerStateChanged = (state: SpotifyState) => {
      setPaused(state.paused);
      setCurrentTrack(state.track_window.current_track.name);
    };
    if (player) {
      player.addListener("player_state_changed", playerStateChanged);
    }
    return () => {
      if (player) {
        player.removeListener("player_state_changed", playerStateChanged);
      }
    };
  }, [player]);
  React.useEffect(() => {
    if (volume <= 0) {
      return setVolume(0);
    } else if (volume >= 100) {
      return setVolume(100);
    }
  }, [volume]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const user = data;

  return (
    <div className="all-body d-flex flex-column">
      <div className="bodyNavBar d-flex justify-content-evenly">
        <div className="all-sidebar col-2" style={{ height: "44rem" }}>
          <Layout isLoggedIn={true}>
            <p style={{ color: "white" }}> Hello {user && user.display_name}</p>
            {/* <p style={{ color: "white" }}>{currentTrack}</p> */}
          </Layout>
        </div>
        <div className="centre-body col-10">
          <div>
            <nav className="navbar navbar-laft navbar-custom">
              <div className="d-flex justify-content">
                <div className="navOfBody container-fluid">
                  <form className="d-flex">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Artites, titres ou albums"
                      aria-label="Search"
                      style={{ width: "20rem" }}
                    />
                    <button
                      className="btn btn-outline-success"
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "10px 10px",
                        whiteSpace: "nowrap",
                        width: "100px",
                      }}
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </nav>
          </div>
          <div className="col d-flex justify-content-around text-center">
            <div className="column">
              <button
                onClick={() => reglageNavAlbum()}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 10px",
                  whiteSpace: "nowrap",
                  width: "100px",
                }}
                className="btn btn-dark"
              >
                Album
              </button>
              {navAlbum ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturealbum} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">
                      {targetAlbum.map((track: song) => {
                        return (
                          <li className="listMusique list-unstyled" key={track.uri}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-play"
                              viewBox="0 0 16 16"
                              onClick={() => {
                                play(accessToken, deviceId, track.uri, nextPrevious);
                              }}
                            >
                              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                            </svg>
                            {track.name}
                          </li>
                        );
                      })}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="column">
              <button
                className="btn btn-dark"
                onClick={() => reglageNavTrack()}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 10px",
                  whiteSpace: "nowrap",
                  width: "100px",
                }}
              >
                Track
              </button>
              {navTrack ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturetrack} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">{currentTrack}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="column">
              <button
                onClick={() => reglageNavPlaylist()}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 10px",
                  whiteSpace: "nowrap",
                  width: "100px",
                }}
                className="btn btn-dark"
              >
                Playlist
              </button>
              {navPlaylist ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturelist} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">
                      {playlist.map((trackname: song) => {
                        return (
                          <li className="list-unstyled" key={trackname.uri}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-play"
                              viewBox="0 0 16 16"
                              onClick={() => {
                                play(accessToken, deviceId, trackname.uri, nextPrevious);
                              }}
                            >
                              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                            </svg>
                            {trackname.name}
                          </li>
                        );
                      })}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="body d-flex justify-content">
        <div className="titre" style={{ width: "15rem" }}>
          <br />
          <h3 className="titre-musique">{currentTrack}</h3>
        </div>
        <div className="milieu" style={{ width: "60rem" }}>
          <div className="text-center" style={{ height: "5.5rem" }}>
            <div className="media-controls">
              <br />
              <div className="media-buttons d-flex justify-content-evenly">
                <br />
                <button
                  onClick={() => {
                    previous(accessToken, deviceId);
                  }}
                  className="btn btn-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-skip-start-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM9.71 5.093 7 7.028V5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V8.972l2.71 1.935a.5.5 0 0 0 .79-.407v-5a.5.5 0 0 0-.79-.407z" />
                  </svg>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    paused ? play(accessToken, deviceId, track, nextPrevious) : pause(accessToken, deviceId);
                  }}
                >
                  {paused ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-play-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-stop-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    next(accessToken, deviceId);
                  }}
                  className="btn btn-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-skip-end-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407L9.5 8.972V10.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-1 0v1.528L6.79 5.093z" />
                  </svg>
                </button>
                <br />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center-right d-flex justify-content">
            <div className="container">
              <br />
              <button className="buttonVolume" onClick={() => reglageVolume(-10)}>
                <i className="fas fa-volume-down"></i>
              </button>
              <button className="buttonVolume" onClick={() => reglageVolume(10)}>
                <i className="fas fa-volume-up"></i>
              </button>
              <h1 className="text-volume">Volume: {volume}%</h1>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .centre-body {
          background-color: #272727;
        }
        .body {
          background-color: #181818;
        }
        .buttonVolume {
          width: 2rem;
          margin-right: 1rem;
          border-radius: 15px;
        }
        .card-text {
          overflow: scroll;
          max-height: 15rem;
        }
        .titre-musique {
          color: white;
          font-size: 20px;
          overflow: scroll;
          max-height: 4.5rem;
          margin-left: 2rem;
        }
        .text-volume {
          color: white;
          font-size: 20px;
        }
        .all-sidebar {
          background-color: black;
        }
      `}</style>
    </div>
  );
};
export default Player;

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<unknown> => {
  const cookies = new Cookies(context.req, context.res);
  const accessToken = cookies.get("spot-next");
  if (accessToken) {
    return { props: { accessToken } };
  } else {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
