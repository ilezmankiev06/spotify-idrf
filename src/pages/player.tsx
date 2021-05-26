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

type Album = {
  id: string;
  title: string;
  cover: string;
};

type Playlists = {
  track: {
    uri: string;
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

const getAlbum = async (accessToken: string, setTargetAlbum: any) => {
  return fetch(`https://api.spotify.com/v1/albums/5GAvwptqr4r63i8lZWrL58`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((result: SpotifyTrack) => {
      console.log("kldjfksdhfksdhfksdhk", result.uri);
      setTargetAlbum(result.uri);
      // return {
      //   id: result.id,
      //   title: result.name,
      //   cover: result.images,
      // };
    });
};

const getPlaylists = async (accessToken: string, setPlaylist: any) => {
  return await fetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((play) => {
      console.log(play);
      const tab: any = [];
      play.items.map((song: Playlists) => tab.push(song.track.uri));
      setPlaylist(tab);
    });
};

export const getTrack = async (accessToken: string, setTrack: any, setPicture: any) => {
  return await fetch("https://api.spotify.com/v1/tracks/6nQy5XEEEJKu8FE1FS2Wbt", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((song) => {
      setPicture(song.album.images[1].url);
      setTrack(song.uri);
    });
};

const myAlbum: Album = {
  id: "5GAvwptqr4r63i8lZWrL58",
  title: "My turn",
  cover: "https://m.media-amazon.com/images/I/41j+BCAmgOL._SL1000_.jpg",
};
const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(true);
  const [currentTrack, setCurrentTrack] = React.useState<any>("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [targetAlbum, setTargetAlbum] = React.useState(myAlbum);
  const [track, setTrack] = React.useState("");
  const [playlist, setPlaylist] = React.useState([""]);
  const [picture, setPicture] = React.useState("");

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

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const user = data;

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-evenly">
        <div className="col-2 bg-dark" style={{ height: "44rem" }}>
          <Layout isLoggedIn={true}>
            <p>Welcome {user && user.display_name}</p>
            <p>{currentTrack}</p>

            <button
              onClick={() => {
                getPlaylists(accessToken, setPlaylist);
              }}
            >
              test
            </button>
          </Layout>
        </div>
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
          <div className="d-flex justify-content-evenly">
            <div className="card" style={{ width: "18rem" }}>
              <img src={picture} className="card-img-top" alt="..." />
              <div className="card-body">
                <p className="card-text">
                  <button
                    className="boutton btn btn-outline-success"
                    type="submit"
                    style={{ width: "5rem" }}
                    onClick={() => {
                      getTrack(accessToken, setTrack, setPicture);
                    }}
                  >
                    {currentTrack}
                  </button>
                </p>
              </div>
            </div>

            <div className="card" style={{ width: "18rem" }}>
              <img src={picture} className="card-img-top" alt="..." />
              <div className="card-body">
                <p className="card-text">
                  <button
                    className="boutton btn btn-outline-success"
                    type="submit"
                    style={{ width: "5rem" }}
                    onClick={() => {
                      getPlaylists(accessToken, setPlaylist);
                    }}
                  >
                    recuperer playlist
                  </button>
                  {playlist.map((track) => {
                    return (
                      <li>
                        <button
                          onClick={() => {
                            play(accessToken, deviceId, track);
                          }}
                        >
                          {currentTrack}
                        </button>
                        {track}
                      </li>
                    );
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <h1>Volume</h1>
        </div>
      </div>
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
