import express from "express";
import { readAllTracks, readTrackById } from "../db/queries/tracks.js";


const tracksRouter = express.Router();


tracksRouter.get("/", async (req, res, next) => {
  try {
    const tracks = await readAllTracks();
    if (tracks) {
      res.send(tracks);
    } else {
      res.status(400).send("error reading all tracks");
    }
  } catch (err) {
    console.error('error in get handler for "/tracks/"');
    next(err);
  }

});


tracksRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const numRegex = /\D/;
  if (numRegex.test(id) || Number(id) < 1) {
    res.status(400).send("id must be a positive integer");
    return;
  }
  try {
    const idNum = Number(id);
    const track = await readTrackById(idNum);
    if (track) {
      res.send(track);
    } else {
      res.status(404).send("track does not exist");
    }
  } catch (err) {
    console.error("error in get handler for '/tracks/:id'");
  }
});

export default tracksRouter;
