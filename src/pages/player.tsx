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

export const play = (accessToken: string, deviceId: string, track: any) => {
  console.log(track);
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [track],
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

const getAlbum = async (accessToken: string, setTargetAlbum: any, setPicturealbum: any) => {
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
      console.log("kldjfksdhfksdhfksdhk", result.tracks.items);
      setPicturealbum(result.images[1].url);
      result.tracks.items.map((song: song) =>
        tab.push({
          uri: song.uri,
          name: song.name,
        }),
      );
      setTargetAlbum(tab);
    });
};

const getPlaylists = async (accessToken: string, setPlaylist: any, setPicturelist: any) => {
  return await fetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((play) => {
      console.log(play.items);
      const tab: any = [];
      setPicturelist(play.items[0].track.album.images[1].url);
      play.items.map((song: Playlists) =>
        tab.push({
          uri: song.track.uri,
          name: song.track.name,
        }),
      );
      setPlaylist(tab);
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

  const reglageVolume = (value: number) => {
    setVolume(volume + value);
    Volumes(accessToken, deviceId, volume);
  };

  const reglageNavAlbum = () => {
    setNavTrack(false);
    setNavAlbum(true);
    setNavPlaylist(false);
    getAlbum(accessToken, setTargetAlbum, setPicturealbum);
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
    getPlaylists(accessToken, setPlaylist, setPicturelist);
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
    <div className="d-flex flex-column">
      <div className="bodyNavBar d-flex justify-content-evenly">
        <div className="col-2 bg-dark" style={{ height: "44rem" }}>
          <Layout isLoggedIn={true}>
            <p style={{ color: "white" }}>Welcome {user && user.display_name}</p>
            <p style={{ color: "white" }}>{currentTrack}</p>
          </Layout>
        </div>
        <div className="col-10">
          <div>
            <nav className="navbar navbar-laft navbar-custom">
              <div className="d-flex justify-content">
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
          </div>
          <div className="col d-flex justify-content-around">
            <div className="column">
              <button onClick={() => reglageNavAlbum()}>Album</button>
              {navAlbum ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturealbum} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">
                      <button
                        className="boutton btn btn-outline-success"
                        type="submit"
                        style={{ width: "5rem" }}
                        onClick={() => {
                          getAlbum(accessToken, setTargetAlbum, setPicturealbum);
                        }}
                      >
                        Album
                      </button>
                      {targetAlbum.map((track: song) => {
                        return (
                          <li className="listMusique list-unstyled">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-play"
                              viewBox="0 0 16 16"
                              onClick={() => {
                                play(accessToken, deviceId, track.uri);
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
              <button onClick={() => reglageNavTrack()}>track</button>
              {navTrack ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturetrack} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">
                      <button
                        className="boutton btn btn-outline-success"
                        type="submit"
                        style={{ width: "5rem" }}
                        onClick={() => {
                          getTrack(accessToken, setTrack, setPicturetrack);
                        }}
                      >
                        Track
                        {currentTrack}
                      </button>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="column">
              <button onClick={() => reglageNavPlaylist()}>Playlist</button>
              {navPlaylist ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img src={picturelist} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <p className="card-text">
                      <button
                        className="boutton btn btn-outline-success"
                        type="submit"
                        style={{ width: "5rem" }}
                        onClick={() => {
                          getPlaylists(accessToken, setPlaylist, setPicturelist);
                        }}
                      >
                        Playlist
                      </button>
                      {playlist.map((trackname: song) => {
                        return (
                          <li className="list-unstyled">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-play"
                              viewBox="0 0 16 16"
                              onClick={() => {
                                play(accessToken, deviceId, trackname.uri);
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
          <h1>{currentTrack}</h1>
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
                <button
                  onClick={() => {
                    paused ? play(accessToken, deviceId, track) : pause(accessToken, deviceId);
                  }}
                >
                  {paused ? "play" : "stop"}
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
          <div className="text-center d-flex justify-content">
            <div className="slidecontainer">
              <h1>Volume</h1>
              {volume}
              <button className="buttonVolume" onClick={() => reglageVolume(10)}>
                plus
              </button>
              <button onClick={() => reglageVolume(-10)}>moins</button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .buttonVolume {
          margin-right: 1rem;
          margin-left: 1rem;
        }
        .card-text {
          overflow: scroll;
          max-height: 15rem;
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
