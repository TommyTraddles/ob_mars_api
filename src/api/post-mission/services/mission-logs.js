const { sql } = require('slonik')

const {
  isFatalAction,
  createDangerZone,
  checkFlaggedZones,
  updateRobotStatus,
  updateRobotLogStatus,
  retrieveLastStepStored,
  writeActionOnMissionLog,
  retrieveLastSafeZoneKnown,
} = require('../queries/mission-logs-queries')

async function updateRobotLog(
  db,
  { batch, robotId, x, y, step, compass, instruction, lost_signal = false },
  { BOARD }
) {
  try {
    return db.transaction(async (tx) => {
      // Check if it is a flagged area
      const { rows: zoneIsFlagged } = await checkFlaggedZones(
        db,
        { x, y, compass },
        { BOARD }
      )

      if (zoneIsFlagged[0] && instruction == 'F') {
        console.info('🟥 Flagged area', step)
        return { avoid_execution: true }
      }

      // Execute the query
      await writeActionOnMissionLog(
        tx,
        { robotId, batch, instruction, step, x, y, compass, lost_signal },
        { BOARD }
      )

      // If the query is safe
      const { rows: isFatalLog } = await isFatalAction(
        tx,
        { robotId, step },
        { BOARD }
      )

      
      if (!isFatalLog.length) return { avoid_execution: false }
      if (zoneIsFlagged[0] && instruction != 'F') {
        return { avoid_execution: true }
      }
      

      // If the query is not safe
      console.info('❌ ROBOT LOST', --step)

      const { rows: lastStepStored } = await retrieveLastStepStored(db, {
        robotId,
      })
      const { rows: lastSafeZoneKnown } = await retrieveLastSafeZoneKnown(
        tx,
        { robotId, step: lastStepStored[0].step },
        { BOARD }
      )
      await createDangerZone(tx, { lastSafeZoneKnown: lastSafeZoneKnown[0] })
      await updateRobotLogStatus(tx, { robotId })
      await updateRobotStatus(tx, { step, robotId })
      return { avoid_execution: true }
    })
  } catch (error) {
    console.info(
      `> ❌ Error at [ updateRobotLog | robot: ${batch} | step: ${step} ] query: ${error.stack}`
    )
    return false
  }
}

module.exports = {
  updateRobotLog,
}
