import db from "../client.js";

export const createPlaylist = async ({ name, description }) => {
  const sql = `
  INSERT INTO playlists (name, description)
  VALUES ($1, $2)
  RETURNING *;
  `;
  try {
    const { rows: [playlist] } = await db.query(sql, [name, description]);
    return playlist;
  } catch (err) {
    console.error('error in createPlaylist: ', err);
    throw err;
  }
}

export const readPlaylistById = async (id) => {
  const sql = `
  SELECT * FROM playlists
  WHERE playlists.id = $1;
  `;
  try {
    const { rows: [playlist] } = await db.query(sql, [id]);
    return playlist;
  } catch (err) {
    console.error('error in readPlaylistById: ', err);
    throw err;
  }
}

export const readAllPlaylists = async () => {
  const sql = `
  SELECT * FROM playlists;
  `;
  try {
    const { rows: playlists } = await db.query(sql);
    return playlists;
  } catch (err) {
    console.error('error in readAllPlaylists: ', err);
    throw err;
  }
}

// TODO: this is not finished
export const readTracksInPlaylist = async (playlistId) => {
  const sql = `
  SELECT playlists_tracks.track_id AS id, tracks.name, tracks.duration_ms
  FROM playlists_tracks
  JOIN tracks ON playlists_tracks.track_id = tracks.id
  WHERE playlists_tracks.playlist_id = $1;
  `;
  try {
    const { rows: tracks } = await db.query(sql, [playlistId]);
    return tracks;
  } catch (err) {
    console.error('error in readTracksInPlaylist: ', err);
    throw err;
  }
}
