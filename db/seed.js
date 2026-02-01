import db from "#db/client";
import { createPlaylist } from "./queries/playlists.js";
import { createTrack } from "./queries/tracks.js";
import { createPlaylistTrack } from "./queries/playlists_tracks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    // create 20 tracks
    await createTrack({ name: `track ${i}`, durationMs: 2344 + i });
  }
  
  for (let i = 1; i <= 10; i++) {
    // create 10 playlists
    await createPlaylist({ name: `playlist ${i}`, description: `lorem ipsum ad nauseam` })
  }
  for (let i = 1; i <= 10; i += 2) {
    // create 15 playlists_tracks
    for (let j = 1; j <= 9; j += 3) {
      await createPlaylistTrack({ playlistId: i, trackId: j });
    }
  }
}
