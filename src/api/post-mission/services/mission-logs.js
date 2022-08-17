const { sql } = require('slonik')

const {
  isFatalAction,
  deleteLastRow,
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
  {
    x,
    y,
    step,
    batch,
    compass,
    robotId,
    instruction = null,
    lost_signal = false,
  },
  { BOARD }
) {
  try {
    return db.transaction(async (tx) => {
      // mission store nextInstruction on DB
      await writeActionOnMissionLog(
        tx,
        {
          x,
          y,
          step,
          batch,
          robotId,
          compass,
          lost_signal,
          instruction,
        },
        { BOARD }
      )

      // check if the query is safe
      const { rows: isFatalLog } = await isFatalAction(
        tx,
        { robotId, step },
        { BOARD }
      )

      // If the query is safe
      if (!isFatalLog.length) return { avoid_execution: false }

      // If the query is unsafe
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
      await updateRobotStatus(tx, { robotId })
      await updateRobotLogStatus(tx, { step, robotId })
      await deleteLastRow(tx, { step, robotId })
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
