const { sql } = require('slonik')

async function writeActionOnMissionLog(
  db,
  {
    robotId,
    batch,
    instruction = null,
    step,
    x,
    y,
    compass,
    lost_signal = false,
  },
  { BOARD }
) {
  console.log(
    '🟦 ',
    'robot:',
    batch,
    'step:',
    step,
    'x:',
    x,
    'y:',
    y,
    'instruction:',
    instruction,
    'compass:',
    compass
  )

  return await db.query(sql`
    INSERT INTO robots_logs 
      (robot_id, surface_id, mission_id, instruction, step, x, y, compass, lost_signal, batch)
    VALUES
      (${robotId}, ${BOARD.id}, ${BOARD.mission_id}, ${instruction}, ${step}, ${x}, ${y}, ${compass}, ${lost_signal}, ${batch});
  `)
}

async function retrieveCreatedLogEntry(db, { batch, step }, { BOARD }) {
  return await db.query(sql`
    SELECT * 
    FROM robots_logs
    WHERE surface_id = ${BOARD.id}
      AND batch = ${batch}
      AND step = ${step};
  `)
}

async function isFatalAction(db, { robotId, step }, { BOARD }) {
  return await db.query(sql`
    SELECT * 
    FROM robots_logs
    WHERE
      robot_id = ${robotId}
      AND surface_id = ${BOARD.id}
      AND step = ${step}
      AND (x > ${BOARD.x}
        OR y > ${BOARD.y}
        OR x < 0
        OR y < 0);
  `)
}

async function retrieveLastSafeZoneKnown(db, { robotId, step }, { BOARD }) {
  return await db.query(sql`
    SELECT * 
    FROM robots_logs
    WHERE 
      robot_id = ${robotId}
      AND surface_id = ${BOARD.id}
      AND step = ${step};
  `)
}

async function retrieveDangerZone(db, { BOARD }) {
  return await db.query(sql`
    SELECT *
    FROM danger_zones
    WHERE surface_id = ${BOARD.id}
      AND mission_id = ${BOARD.mission_id};
  `)
}

async function createDangerZone(db, { lastSafeZoneKnown }) {
  return await db.query(sql`
    INSERT INTO danger_zones
      (robot_id, surface_id, mission_id, x, y, compass)
    VALUES
      (${lastSafeZoneKnown.robot_id}, ${lastSafeZoneKnown.surface_id}, ${lastSafeZoneKnown.mission_id}, ${lastSafeZoneKnown.x}, ${lastSafeZoneKnown.y}, ${lastSafeZoneKnown.compass})
  `)
}

async function updateRobotStatus(db, { robotId }) {
  return await db.query(sql`
    UPDATE robots
      SET lost_signal = true
      WHERE id = ${robotId}
  `)
}

async function deleteLastRow(db, { step, robotId }) {
  return await db.query(sql`
    DELETE FROM robots_logs
    WHERE robot_id = ${robotId}
      AND step = ${++step}
  `)
}

async function updateRobotLogStatus(db, { step, robotId }) {
  return await db.query(sql`
    UPDATE robots_logs
      SET lost_signal = true
      WHERE robot_id = ${robotId}
        AND step = ${step}
  `)
}

async function searchRobotStatusById(db, { robotId }) {
  const { rows: lost_signal } = await db.query(sql`
    SELECT lost_signal
    FROM robots
    WHERE id = ${robotId};
  `)
  return lost_signal[0]
}

async function checkFlaggedZones(db, { x, y, compass }, { BOARD }) {
  return await db.query(sql`
    SELECT *
    FROM danger_zones
    WHERE surface_id = ${BOARD.id}
    AND x = ${x}
    AND y = ${y}
    AND compass = ${compass};
  `)
}

async function retrieveLastStepStored(db, { robotId }) {
  return await db.query(sql`
    SELECT step
    FROM robots_logs
    WHERE robot_id = ${robotId}
    ORDER BY step DESC
    LIMIT 1; 
  `)
}

module.exports = {
  deleteLastRow,
  isFatalAction,
  createDangerZone,
  checkFlaggedZones,
  updateRobotStatus,
  retrieveDangerZone,
  updateRobotLogStatus,
  searchRobotStatusById,
  retrieveLastStepStored,
  writeActionOnMissionLog,
  retrieveCreatedLogEntry,
  retrieveLastSafeZoneKnown,
}
