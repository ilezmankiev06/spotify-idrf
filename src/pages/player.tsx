import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import NavBarBody from "../components/navBarBody";
import TabBar from "../components/tabBar";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser } from "../types/spotify";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

export const play = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: ["spotify:track:1lCRw5FEZ1gPDNPzy1K4zW"],
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

const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(true);
  const [currentTrack, setCurrentTrack] = React.useState("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);

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
          </Layout>
        </div>
        <NavBarBody></NavBarBody>
      </div>
      <div>
        <TabBar>
        </TabBar>
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
