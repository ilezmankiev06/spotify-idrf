import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import NavBarBody from "../components/navBarBody";
import Lecteur from "../components/lecteur";
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

const getPlaylists = async (accessToken: string, setCurrentTrack: any) => {
  return await fetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((play) => {
      play.items.map((result: Playlists) => {
        console.log("tututututututuutututututu", result.track.uri);
        return setCurrentTrack(result.track.uri);
      });
    });
};

export const getTrack = async (accessToken: string, setTrack: any) => {
  return await fetch("https://api.spotify.com/v1/tracks/6nQy5XEEEJKu8FE1FS2Wbt", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((song) => setTrack(song.uri));
};

export const Volumes = (accessToken: string, volume: number) => {
  return fetch(`https://api.spotify.com/v1/me/player/volume=${volume}`, {
  method: "PUT",
  headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
  const [playlist, setPlaylist] = React.useState("");

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
                paused ? play(accessToken, deviceId, track) : pause(accessToken, deviceId);
              }}
            >
              {paused ? "play" : "stop"}
            </button>
            <button
              onClick={() => {
                getPlaylists(accessToken, setPlaylist);
              }}
            >
              test
            </button>
          </Layout>
        </div>
        <NavBarBody>
        <button
              onClick={() => {
                getTrack(accessToken, setTrack);
              }}
            >
              recuperation track
            </button>
        </NavBarBody>
      </div>
      <div>
        <Lecteur></Lecteur>
      </div>
      <style>
        {`
        .boutton {
          margin-left: 3rem;
        }
        `}
      </style>
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
