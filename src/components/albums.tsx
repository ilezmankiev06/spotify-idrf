import React from "react";
// import { Album } from "../types/spotify";

type Album = {
  id: string;
  title: string;
  cover: string;
};

const Albums: React.FC<Album> = (props) => {
  console.log(props.cover);
  return (
    <div>
      <p>{props.title}</p>
      <p>{props.id}</p>
      <img src={props.cover} alt="" />
    </div>
  );
};

export default Albums;
