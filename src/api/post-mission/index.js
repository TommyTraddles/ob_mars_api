const {
  robotFactory,
  startMission,
  updateRobotLog,
  renderMissionStatistics,
} = require('./services')
const { searchRobotStatusById } = require('./queries/mission-logs-queries')

module.exports = (db) => async (req, res, next) => {
  const { surface, INPUT } = res.locals

  const BOARD = await startMission(db, { x: surface.x, y: surface.y })
  if (!BOARD) {
    next({
      success: false,
      error: new Error('Something went wrong'),
    })
  }

  for (let inputIdx in INPUT) {
    inputIdx = Number(inputIdx)
    const initialState = INPUT[inputIdx]

    const newRobot = await robotFactory(
      db,
      {
        batch: inputIdx,
        y: initialState.y,
        x: initialState.x,
        compass: initialState.compass,
        instructions: initialState.instructions,
      },
      { BOARD }
    )

    if (!newRobot.info) {
      next({
        success: false,
        error: new Error(`[Robot ${inputIdx}]: Problem at manufacturing`),
      })
    }

    INPUT[inputIdx].id = newRobot.info.id
    const instructions = newRobot.info.instructions.split('')
    for (let idx in instructions) {
      const instruction = instructions[idx]
      idx = Number(idx)

      const { lost_signal } = await searchRobotStatusById(db, {
        robotId: newRobot.info.id,
      })

      if (!lost_signal) {
        const executeAction = await updateRobotLog(
          db,
          {
            step: idx,
            batch: inputIdx,
            y: newRobot.info.y,
            x: newRobot.info.x,
            instruction: instruction,
            robotId: newRobot.info.id,
            compass: newRobot.info.compass,
            lost_signal: newRobot.info.lost_signal,
          },
          { BOARD }
        )

        if (!executeAction) {
          return next({
            success: false,
            error: new Error(`[Robot ${newRobot.info.id}]: Malfunction`),
          })
        }

        if (executeAction.avoid_execution) continue

        instruction == 'F'
          ? newRobot.move({ newRobot: newRobot.info })
          : newRobot.rotate({ newRobot: newRobot.info, instruction })
      }
    }
  }

  setTimeout(() => console.log('🟩 EXECUTION FINISHED'), 0)

  const missionStatistics = await renderMissionStatistics(db, { BOARD, INPUT })

  if (!missionStatistics) {
    return next({
      success: false,
      error: new Error('Something went wrong, try again later'),
    })
  }

  return res.json({
    success: true,
    missionStatistics,
  })
}
