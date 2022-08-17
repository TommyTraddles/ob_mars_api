const { sql } = require('slonik')

const {
  retrieveJourneyByRobot,
  retrieveUniqueSurfacesByRobot,
  retrieveIdentifiedDangerZones,
  retrieveMissionExploredSurface,
} = require('../queries/mission-statistics-queries')

async function renderMissionStatistics(db, { INPUT, BOARD }) {
  const totalSurface = BOARD.x * BOARD.y

  const { rows: missionTotalExploredSurface } =
    await retrieveMissionExploredSurface(db, { BOARD })

  const { rows: missionIdentifiedDangerZones } =
    await retrieveIdentifiedDangerZones(db, { BOARD })

  const missionRobotsFinalLogs = []

  for (let idx in INPUT) {
    idx = Number(idx)
    const { id } = INPUT[idx]

    const { rows: robotJourney } = await retrieveJourneyByRobot(
      db,
      { id },
      { BOARD }
    )

    const { rows: robotUniqueAreasCovered } =
      await retrieveUniqueSurfacesByRobot(db, { id }, { BOARD })

    const lastIdx = robotJourney.length - 1

    const robotLog = {
      robotId: id,
      totalExploredSurface: `${robotUniqueAreasCovered.length} m2 | ${~~(
        (100 * robotUniqueAreasCovered.length) /
        totalSurface
      )}%`,
      resume: {
        position: [robotJourney[lastIdx].x, robotJourney[lastIdx].y],
        compass: robotJourney[lastIdx].compass,
        lost: robotJourney[lastIdx].lost_signal,
      },
      robotJourney,
    }

    missionRobotsFinalLogs.push(robotLog)
  }

  return {
    missionId: BOARD.mission_id,
    sentRobots: INPUT.length,
    lostRobots: missionIdentifiedDangerZones.length,
    surfaceDimentions: [BOARD.x, BOARD.y],
    surfaceTotalArea: `${totalSurface} m2`,
    totalExploredSurface: `${missionTotalExploredSurface.length} m2 | ${~~(
      (100 * missionTotalExploredSurface.length) /
      totalSurface
    )}%`,
    exploredSurface: missionTotalExploredSurface,
    dangerousZonesIdentified: missionIdentifiedDangerZones,
    robotLogs: missionRobotsFinalLogs,
  }
}

module.exports = {
  renderMissionStatistics,
}
