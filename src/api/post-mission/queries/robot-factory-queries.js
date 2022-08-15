const { sql } = require('slonik')

async function searchExistingRobot(
  db,
  { x, y, compass, batch, instructions },
  { surfaceId, missionId }
) {
  return await db.query(sql`
    SELECT * 
    FROM robots 
    WHERE 
      x = ${x}
      AND y = ${y}
      AND batch = ${batch}
      AND compass = ${compass}
      AND surface_id = ${surfaceId}
      AND mission_id = ${missionId}
      AND instructions = ${instructions}
  `)
}

async function createRobot(
  db,
  { batch, x, y, compass, instructions },
  { surfaceId, missionId }
) {
  return db.query(sql`
    INSERT INTO robots (surface_id, mission_id, x, y, compass, instructions, batch) 
    VALUES (${surfaceId}, ${missionId}, ${x}, ${y}, ${compass}, ${instructions}, ${batch});
  `)
}

module.exports = {
  createRobot,
  searchExistingRobot,
}
