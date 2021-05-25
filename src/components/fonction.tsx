type SpotifyTrack = {
  id: string;
  uri: string;
  type: "track" | "album" | "artist" | "user";
  linked_from_uri: any;
  linked_from: {
    uri: string | null;
    id: string | null;
  };
  media_type: string;
  name: string;
  duration_ms: number;
  artists: {
    name: string;
    uri: string;
  }[];
  album: {
    uri: string;
    name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
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
    .then((response) => {
      console.log("tututututu", response);
      return response.json();
    })
    .then((play) => {
      console.log("taratatata", play);
      const items = play.items.map((result: SpotifyTrack) => result.uri);
      console.log("iteeeeemmsmmms", items);
      return items;
    });
};

export { play, pause, getPlaylists, album };
