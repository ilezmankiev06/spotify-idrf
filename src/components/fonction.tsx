// export const getTrack = async (accessToken: string, setdisplayedSong: string) => {
//   return await fetch("https://api.spotify.com/v1/tracks/1imMjt1YGNebtrtTAprKV7", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((piste) => console.log(piste.uri));
// };

// export default getPlaylists;

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
