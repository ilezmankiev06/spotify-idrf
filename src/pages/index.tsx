import Cookies from "cookies";
import { GetServerSideProps } from "next";
import useSWR from "swr";

import { Layout } from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";

type IndexProps = {
  spotifyLoginUrl?: string;
};

const Index: React.FC<IndexProps> = ({ spotifyLoginUrl }) => {
  const { data } = useSWR("/api/get-user-info");
  const user = data;

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-evenly">
        <div className="col-2 bg-dark" style={{ height: "44rem" }}>
          <Layout isLoggedIn={user !== undefined} spotifyLoginUrl={spotifyLoginUrl}>
            <p>{user && user.display_name}</p>
          </Layout>
        </div>
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
export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const accessToken = cookies.get("spot-next");
  if (accessToken) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/player",
      },
    };
  } else {
    const spotifyLoginUrl = new URL("https://accounts.spotify.com/authorize");

    spotifyLoginUrl.searchParams.append("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "");
    spotifyLoginUrl.searchParams.append("redirect_uri", process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "");
    spotifyLoginUrl.searchParams.append("response_type", "code");
    spotifyLoginUrl.searchParams.append(
      "scope",
      [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
      ].join(" "),
    );

    return {
      props: {
        spotifyLoginUrl: spotifyLoginUrl.toString(),
      },
    };
  }
};
