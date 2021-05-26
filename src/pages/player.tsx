import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import NavBarBody from "../components/navBarBody";
import TabBar from "../components/tabBar";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser } from "../types/spotify";
import Albums from "../components/albums";

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

export const play = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: ["spotify:track:1imMjt1YGNebtrtTAprKV7"],
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

const getAlbum = async (accessToken: string) => {
  return fetch(`https://api.spotify.com/v1/albums/5GAvwptqr4r63i8lZWrL58`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return {
        id: result.id,
        title: result.name,
        cover: result.images,
      };
    });
};

const getPlaylists = async (accessToken: string) => {
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
        return result.track.uri;
      });
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
                paused ? play(accessToken, deviceId) : pause(accessToken, deviceId);
              }}
            >
              {paused ? "play" : "stop"}
            </button>
            <button
              onClick={() => {
                getAlbum(accessToken);
              }}
            >
              test
            </button>
            <Albums id={targetAlbum.id} title={targetAlbum.title} cover={targetAlbum.cover} />
          </Layout>
        </div>
        <NavBarBody></NavBarBody>
      </div>
      <div>
        <TabBar></TabBar>
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
