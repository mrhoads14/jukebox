import express from "express"
import {
  readAllPlaylists,
  createPlaylist,
  readPlaylistById,
  readTracksInPlaylist
} from "../db/queries/playlists.js";
import { readTrackById } from "#db/queries/tracks";
import { readPlaylistTrack, createPlaylistTrack } from "../db/queries/playlists_tracks.js";


const playlistsRouter = express.Router();


playlistsRouter.get("/", async (req, res, next) => {
  try {
    const playlists = await readAllPlaylists();
    if (playlists) {
      res.send(playlists);
    } else {
      res.status(400).send("error reading all Playlists");
    }
  } catch (err) {
    console.error("error in handler for /playlists");
    next(err);
  }
});


playlistsRouter.post("/", async (req, res, next) => {
  if (!req.body || !(req.body.name && req.body.description)) {
    res.status(400).send("request must include body and name and description");
  }
  try {
    const playlist = await createPlaylist(req.body);
    if (playlist) {
      res.status(201).send(playlist);
    } else {
      res.status(404).send("error creating playlist");
    }
  } catch (err) {
    console.error('error in post playlists endpoing', err);
    next(err);
  }
});


playlistsRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const numRegex = /\D/;
  if (numRegex.test(id) || Number(id) < 1) {
    res.status(400).send("id must be a positive integer");
    return;
  }
  try {
    const idNum = Number(id);
    const playlist = await readPlaylistById(idNum);
    if (playlist) {
      res.send(playlist);
    } else {
      res.status(404).send("playlist does not exist");
    }
  } catch (err) {
    console.error("error in get handler for '/playlist/:id'");
  }
});

playlistsRouter.get("/:id/tracks", async (req, res, next) => {
  const { id } = req.params;
  const numRegex = /\D/;
  if (numRegex.test(id) || Number(id) < 1) {
    res.status(400).send("id must be a positive integer");
    return;
  }
  try {
    const idNum = Number(id);
    const playlist = await readPlaylistById(idNum);
    if (!playlist) {
      res.status(404).send("playlist does not exist");
      return;
    }
    const tracks = await readTracksInPlaylist(idNum);
    if (tracks) {
      res.send(tracks);
    } else {
      res.status(404).send("no playlist or no tracks");
    }
  } catch (err) {
    console.error("error in get handler for '/playlist/:id/tracks'");
  }
});

playlistsRouter.post("/:id/tracks", async (req, res, next) => {
  const { id } = req.params;
  const numRegex = /\D/;
  if (numRegex.test(id) || Number(id) < 1) {
    res.status(400).send("playlist id must be a positive integer");
    return;
  }
  const playlistId = Number(id);

  if (!req.body || !req.body.trackId) {
    res.status(400).send("request must include body and trackId");
    return;
  }
  if (numRegex.test(req.body.trackId) || Number(req.body.trackId) < 1) {
    res.status(400).send("track id must be a positive integer");
    return;
  }
  const trackId = Number(req.body.trackId);

  try {
    const track = await readTrackById(trackId);
    if (!track) {
      res.status(400).send("track does not exist");
      return;
    }

    const playlist = await readPlaylistById(playlistId);
    if (!playlist) {
      res.status(404).send("playlist does not exist");
      return;
    }

    const existingPlaylistTrack = await readPlaylistTrack({ playlistId: playlistId, trackId: trackId });
    if (existingPlaylistTrack) {
      res.status(400).send("track is already in playlist");
      return
    }

    const playlist_track = await createPlaylistTrack({ playlistId: playlistId, trackId: trackId });
    if (playlist_track) {
      res.status(201).send(playlist_track);
    } else {
      res.status(400).send("no playlist exists");
    }
  } catch (err) {
    console.error('error in post playlists endpoing', err);
    next(err);
  }
});

export default playlistsRouter;
