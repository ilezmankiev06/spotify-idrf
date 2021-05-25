type Playlists = {
  track: {
    uri: string;
  };
};

export const play = (accessToken: string, displayedSong: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${displayedSong}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [displayedSong],
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

export const album = (accessToken: string) => {
  return fetch(`https://api.spotify.com/v1/tracks/0DiWol3AO6WpXZgp0goxAV`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
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

export const getTrack = async (accessToken: string, setdisplayedSong: any) => {
  return await fetch("https://api.spotify.com/v1/tracks/7eExIeAIMkxmrlxkzsNBzx", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((piste) => setdisplayedSong(piste.uri));
};

export default getPlaylists;

// export const getServerSideProps = async (accessToken: string): Promise<unknown> => {
//   const playlist = awaitfetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((play) => {
//       const test = play.items;
//       const listTracks = test.map((result: Playlists) => {
//         console.log("tututututututuutututututu", result.track.uri);
//         return result.track.uri;
//       });
//       return <li>{listTracks}</li>;
//     });
//   return { props: { list } };
// };
