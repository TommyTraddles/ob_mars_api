const { updateRobotLog } = require('./mission-logs')
const {
  createRobot,
  searchExistingRobot,
} = require('../queries/robot-factory-queries')

const MOVE = { N: 1, E: 1, S: 1, W: 1 }
const COMPASS = ['N', 'E', 'S', 'W']
const ROTATION = { L: 1, R: 1 }

async function robotFactory(
  db,
  { batch, x, y, compass, instructions },
  { BOARD }
) {
  try {
    await createRobot(
      db,
      {
        x,
        y,
        batch,
        compass,
        instructions,
      },
      {
        missionId: BOARD.mission_id,
        surfaceId: BOARD.id,
      }
    )

    const { rows: data } = await searchExistingRobot(
      db,
      {
        x,
        y,
        batch,
        compass,
        instructions,
      },
      {
        missionId: BOARD.mission_id,
        surfaceId: BOARD.id,
      }
    )

    await updateRobotLog(
      db,
      {
        y,
        x,
        batch,
        step: 0,
        compass: compass,
        lost_signal: false,
        robotId: data[0].id,
        instruction: instructions[0],
      },
      { BOARD }
    )

    function move({ newRobot }) {
      newRobot.compass == 'N' || newRobot.compass == 'S' ? moveY() : moveX()

      function moveY() {
        if (newRobot.compass == 'N') return (newRobot.y += MOVE.N)
        return (newRobot.y -= MOVE.S)
      }

      function moveX() {
        if (newRobot.compass == 'E') return (newRobot.x += MOVE.E)
        return (newRobot.x -= MOVE.W)
      }
    }

    function rotate({ newRobot, instruction }) {
      let compassIdx = COMPASS.indexOf(newRobot.compass)

      function turnLeft() {
        if (compassIdx == 0) return COMPASS.length - 1
        return (compassIdx -= ROTATION[instruction])
      }

      function turnRight() {
        if (compassIdx == COMPASS.length - 1) return 0
        return (compassIdx += ROTATION[instruction])
      }

      const newOrientation = instruction == 'L' ? turnLeft() : turnRight()
      newRobot.compass = COMPASS[newOrientation]
    }

    return {
      info: data[0],
      rotate,
      move,
    }
  } catch (error) {
    console.info(
      `> ❌ Error at [ robotFactory ${batch} ] query: ${error.stack}`
    )
    return false
  }
}

module.exports = {
  robotFactory,
}
