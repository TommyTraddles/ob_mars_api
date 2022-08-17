const { sql } = require('slonik')

async function retrieveMissionExploredSurface(db, { BOARD }) {
  return await db.query(sql`
    SELECT
      DISTINCT x, y
    FROM robots_logs 
    WHERE 
      surface_id = ${BOARD.id}
      AND x <= ${BOARD.x}
      AND y <= ${BOARD.y}
      ORDER BY x;
  `)
}

async function retrieveIdentifiedDangerZones(db, { BOARD }) {
  return await db.query(sql`
    SELECT x, y, compass
    FROM danger_zones
    WHERE surface_id = ${BOARD.id};
  `)
}

async function retrieveJourneyByRobot(db, { id }, { BOARD }) {
  return await db.query(sql`
    SELECT
      step, x, y, compass, lost_signal
    FROM robots_logs 
    WHERE 
      surface_id = ${BOARD.id}
      AND robot_id = ${id}
      ORDER BY step;
  `)
}

async function retrieveUniqueSurfacesByRobot(db, { id }, { BOARD }) {
  return await db.query(sql`
    SELECT
      DISTINCT x, y
    FROM 
      robots_logs 
    WHERE 
      surface_id = ${BOARD.id}
      AND robot_id = ${id}
      AND lost_signal = false;
    `)
}

module.exports = {
  retrieveJourneyByRobot,
  retrieveIdentifiedDangerZones,
  retrieveUniqueSurfacesByRobot,
  retrieveMissionExploredSurface,
}
