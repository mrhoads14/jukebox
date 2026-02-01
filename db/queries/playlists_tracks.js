import db from "../client.js";
import { readPlaylistById } from "./playlists.js";
import { readTrackById } from "./tracks.js";

export const readPlaylistTrack = async ({ playlistId, trackId }) => {
  const sql = `
  SELECT * FROM playlists_tracks
  WHERE playlists_tracks.playlist_id = $1 AND
    playlists_tracks.track_id = $2;
  `;
  try {
    const { rows: [existingPlaylistTrack] } = await db.query(sql, [playlistId, trackId]);
    return existingPlaylistTrack;
  } catch (err) {
    console.error('error in readPlaylistTrack', err);
    throw err;
  }

}

export const createPlaylistTrack = async ({ playlistId, trackId }) => {
  const sql = `
  INSERT INTO playlists_tracks (playlist_id, track_id)
  VALUES ($1, $2)
  RETURNING *;
  `;
  try {
    const existingPlaylist = await readPlaylistById(playlistId);
    const existingTrack = await readTrackById(trackId);

    if (existingPlaylist && existingTrack) {
      const { rows: [playlistTrack] } = await db.query(sql, [playlistId, trackId]);
      return playlistTrack;
    } else {
      throw Error('playlist and/or track do not exist');
    }
  } catch (err) {
    console.error('error in createPlaylistTrack: ', err);
    throw err;
  }
}
