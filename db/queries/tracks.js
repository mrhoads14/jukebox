import db from "../client.js";

export const createTrack = async ({ name, durationMs }) => {
  const sql = `
  INSERT INTO tracks (name, duration_ms)
  VALUES ($1, $2)
  RETURNING *;
  `;
  try {
    const { rows: [track] } = await db.query(sql, [name, durationMs]);
    return track;
  } catch (err) {
    console.error('error in createTrack: ', err);
    throw err;
  }
}

export const readTrackById = async (id) => {
  const sql = `
  SELECT * FROM tracks
  WHERE tracks.id = $1;
  `;
  try {
    const { rows: [track] } = await db.query(sql, [id]);
    return track;
  } catch (err) {
    console.error('error in readTrackById: ', err);
    throw err;
  }
}
