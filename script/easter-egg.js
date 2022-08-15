'use strict'

/**
               Before running `$npm run easter:egg`

              👋 UNCOMMENT THE QUERIES YOU WANT TO RUN 
              to visualice your instructions on the log

 */

const BOARD = { X: 5, Y: 3 }
const INPUT = [
  // { X: 1, Y: 1, compass: 'E', instructions: 'RFRFRFRF' },
  { X: 3, Y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
  // { X: 0, Y: 3, compass: 'W', instructions: 'LLFFFRFLFL' },
  // { X: 3, Y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLFFFF' },
  // { X: 3, Y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLFFFFRF' },
  // { X: 3, Y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLFFFFRF' },
  // { X: 3, Y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLFFFFRF' },
]

/**
 * ✅ Constants
 */
const COMPASS = ['N', 'E', 'S', 'W']
const MOVE = { N: 1, E: 1, S: 1, W: 1 }
const ROTATION = { L: 1, R: 1 }

/**
 * ✅ Mission's Global variables (Storing data in Array)
 */
const missionRobotsHistory = []
const missionRobotsFinalLogs = []
const missionDangerZones = []
const board = []
for (let idx = BOARD.Y; idx >= 0; idx--) {
  board.push(
    new Array(BOARD.X + 1).fill().map((elm, idx2) => (elm = `${idx},${idx2}`))
  )
}

/**
 * ✅ Starting point
 */

INPUT.forEach((elm, idx) => {
  console.log(credits(elm, idx).robot)
  const { history, gps } = RobotFactory(
    elm.X,
    elm.Y,
    elm.compass,
    elm.instructions
  )
  renderRobotStatistics(idx, history, gps)
})

renderMissionStatistics()

/**
 * ✅ Main Robot Factory
 */

function RobotFactory(X, Y, compass, instructions) {
  const gps = { X, Y, compass }
  const history = [{ X: gps.X, Y: gps.Y, compass: gps.compass }]
  instructions
    .toUpperCase()
    .split('')
    .forEach((elm, idx) => beginExploration(elm, idx))

  function beginExploration(instruction, idx) {
    if (!gps.lost) {
      function rotate() {
        let compassIdx = COMPASS.indexOf(gps.compass)

        function turnLeft() {
          if (compassIdx == 0) return COMPASS.length - 1
          return (compassIdx -= ROTATION[instruction])
        }

        function turnRight() {
          if (compassIdx == COMPASS.length - 1) return 0
          return (compassIdx += ROTATION[instruction])
        }
        const newOrientation = instruction == 'L' ? turnLeft() : turnRight()
        gps.compass = COMPASS[newOrientation]
      }

      function move() {
        function updateMissionHistory() {
          missionRobotsHistory.push({ X: gps.X, Y: gps.Y })
          history.push({
            X: gps.X,
            Y: gps.Y,
            compass: gps.compass,
          })
        }

        function handleSignalLost() {
          console.log(credits().signalLost)
          history.pop()
          gps.lost = true
          updateMissionDangerZones(history[history.length - 1])
          return null
        }

        function isDangerous() {
          if (!missionDangerZones.length) return false
          return missionDangerZones.some(
            (elm) =>
              elm.X == gps.X && elm.Y == gps.Y && elm.compass == gps.compass
          )
        }

        function moveY() {
          if (isDangerous()) return
          if (gps.compass == 'N') return (gps.Y += MOVE.N)
          return (gps.Y -= MOVE.S)
        }

        function moveX() {
          if (isDangerous()) return
          if (gps.compass == 'E') return (gps.X += MOVE.E)
          return (gps.X -= MOVE.W)
        }

        gps.compass == 'N' || gps.compass == 'S' ? moveY() : moveX()
        updateMissionHistory()

        if (gps.X > BOARD.X || gps.X < 0 || gps.Y > BOARD.Y || gps.Y < 0) {
          handleSignalLost()
        }
      }
      instruction == 'F' ? move() : rotate()
      if (!gps.lost) renderRobotJourney(idx, history, gps, instruction)
    }
  }
  return { history, gps }
}

/**
 * ✅ Helper functions
 */

function resetRobotJourney() {
  for (let i = 0; i <= BOARD.Y; i++) {
    for (let j = 0; j < BOARD.X; j++) {
      board[i][j] = `${j},${BOARD.Y - i}`
    }
  }
}

function updateRobotJourney(X, Y, value) {
  const mirrorY = BOARD.Y - Y
  board[mirrorY][X] = value
}

function updateMissionDangerZones(gps) {
  missionDangerZones.push({ X: gps.X, Y: gps.Y, compass: gps.compass })
}

function credits(elm = 0, idx = 0) {
  const robot = `\n\n🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨\n
                    Nº[${++idx}/${INPUT.length}]

            █▀▀█ █▀▀█ █▀▀▄ █▀▀█ ▀▀█▀▀  
            █▄▄▀ █░░█ █▀▀▄ █░░█ ░░█░░ 　  
            ▀░▀▀ ▀▀▀▀ ▀▀▀░ ▀▀▀▀ ░░▀░░ 　 

      initial GPS: X: ${elm.X}, Y: ${elm.Y}, Compass: ${elm.compass}
            instructions: ${elm.instructions}
  `
  const robotLog = `\t\t   \n\n\t\tRetrieving…\n
                  Nº[${idx}/${INPUT.length}]

  █▀▀█ █▀▀█ █▀▀▄ █▀▀█ ▀▀█▀▀ 　 █░░ █▀▀█ █▀▀▀ 
  █▄▄▀ █░░█ █▀▀▄ █░░█ ░░█░░ 　 █░░ █░░█ █░▀█ 
  ▀░▀▀ ▀▀▀▀ ▀▀▀░ ▀▀▀▀ ░░▀░░ 　 ▀▀▀ ▀▀▀▀ ▀▀▀▀
  `
  const missionLog = `\n\n🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧\n\n\t\tRetrieving…\n
  
  █▀▄▀█ ░▀░ █▀▀ █▀▀ ░▀░ █▀▀█ █▀▀▄ 　 █░░ █▀▀█ █▀▀▀ 
  █░▀░█ ▀█▀ ▀▀█ ▀▀█ ▀█▀ █░░█ █░░█ 　 █░░ █░░█ █░▀█ 
  ▀░░░▀ ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀▀ ▀░░▀ 　 ▀▀▀ ▀▀▀▀ ▀▀▀▀
  `
  const signalLost = `\n\n\t\t   ❌❌❌ \n\t\tSignal lost`

  return {
    robot,
    robotLog,
    missionLog,
    signalLost,
  }
}

function renderRobotJourney(idx, history, gps, instruction) {
  if (idx == 0) resetRobotJourney()
  history.forEach((elm, idx) => {
    if (history.length - 1 == idx)
      return updateRobotJourney(elm.X, elm.Y, '🟨 ')
    updateRobotJourney(elm.X, elm.Y, '⬜️ ')
  })
  const data = {
    step: ++idx,
    board,
    instruction,
    updatedGps: gps,
  }
  console.log(data)
}

function renderRobotStatistics(idx, history, gps) {
  const totalSurface = BOARD.X * BOARD.Y
  const initialGps = JSON.parse(JSON.stringify(history[0]))
  const historyCopy = JSON.parse(JSON.stringify(history))
  historyCopy.forEach((elm) => delete elm.compass)
  const exploredSurface = historyCopy.filter(
    (step, idx, arr) =>
      arr.findIndex((elm) =>
        ['X', 'Y'].every((value) => elm[value] == step[value])
      ) == idx
  ).length

  const robotData = {
    ['robot id']: idx,
    ['TLDR']: `${initialGps.X} ${initialGps.Y} ${initialGps.compass}${
      gps.lost ? ' LOST' : ''
    }`,
    ['robot survived']: !gps.lost,
    ['explored surface']: `${exploredSurface} m2 | ${~~(
      (100 * exploredSurface) /
      totalSurface
    )}%`,
    'last seen place': historyCopy[historyCopy.length - 1],
  }
  missionRobotsFinalLogs.push(robotData)
  console.log(credits().robotLog)
  console.log({ robotData })
}

function renderMissionStatistics() {
  const totalSurface = BOARD.X * BOARD.Y
  const totalExploredSurface = missionRobotsHistory.filter(
    (step, idx, arr) =>
      arr.findIndex((elm) =>
        ['X', 'Y'].every((value) => elm[value] == step[value])
      ) == idx
  )

  const missionData = {
    ['Sent Robots']: INPUT.length,
    ['Lost Robots']: missionDangerZones.length,
    ['Mars dimentions']: [BOARD.X, BOARD.Y],
    ['Mars total surface']: `${totalSurface} m2`,
    ['Total explored surface']: `${totalExploredSurface.length} m2 | ${~~(
      (100 * totalExploredSurface.length) /
      totalSurface
    )}%`,
    ['Explored surfaces']: totalExploredSurface,
    ['Dangerous zones identified']: missionDangerZones,
    ['Robot logs']: missionRobotsFinalLogs,
  }
  console.log(credits().missionLog)
  console.log(missionData)
}
