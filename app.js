import express from "express";

import tracksRouter from "./api/tracks.js";
import playlistsRouter from "./api/playlists.js";

const app = express();
export default app;


app.use(express.json());

app.use("/tracks", tracksRouter);

app.use("/playlists", playlistsRouter);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong. It's not you; it's me.");
})
