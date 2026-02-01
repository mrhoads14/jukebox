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
