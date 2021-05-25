type Playlists = {
  track: {
    uri: string;
  };
};
const play = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: ["spotify:track:2Foc5Q5nqNiosCNqttzHof"],
    }),
  });
};

const pause = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const album = (accessToken: string) => {
  return fetch(`https://api.spotify.com/v1/tracks/0DiWol3AO6WpXZgp0goxAV`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
};

const getPlaylists = (accessToken: string) => {
  return fetch("https://api.spotify.com/v1/playlists/3xVCqaHzZ2E67edgUI9w6I/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((play) => {
      const test = play.items;
      test.map((result: Playlists) => {
        console.log("tututututututuutututututu", result.track.uri);
        return result.track.uri;
      });
    });
};

export { play, pause, getPlaylists, album };
