module.exports = (req, res, next) => {
  const {
    body: { surface, robots },
  } = req

  if (!surface) {
    return handleInvalidInput(
      'Missing both Surface coordinates to render the map, follow this schema: { surface: { X: number, Y: number }}'
    )
  }
  const BOARD = objectKeysNormalization(surface)

  if (!BOARD.y || !BOARD.x) {
    return handleInvalidInput(
      'Missing one or the two coordinates needed to render the map'
    )
  }

  if (BOARD.y <= 1 || BOARD.y > 50 || BOARD.x <= 1 || BOARD.x > 50) {
    return handleInvalidInput(
      'The surface coordinate values must be between 1 and 50'
    )
  }

  if (!robots) {
    return handleInvalidInput(
      `Define at least 1 robot for your mission, follow this schema: robots: [{X: number, Y: number, compass: string, instructions: string }]`
    )
  }

  const INPUT = []

  robots.map((elm, idx) => {
    const robot = objectKeysNormalization(elm)

    if (robot.y == null || robot.x == null) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Missing one or the two coordinates needed to place the robot within the map, follow this schema: X: number, Y: number `
      )
    }

    if (!robot.compass) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Missing the starting cardinal direction to place the robot within the map, use this scheme: N (north), E (east), S (south), W (west)`
      )
    }

    robot.compass = robot.compass.toString().toUpperCase()

    if (
      robot.compass != 'E' &&
      robot.compass != 'N' &&
      robot.compass != 'S' &&
      robot.compass != 'W'
    ) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Missing the starting cardinal direction to place the robot within the map, use this scheme: N (north), E (east), S (south), W (west)`
      )
    }

    if (!robot.instructions) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Missing the set of instructions the robot will follow in its journey`
      )
    }

    if (robot.instructions.length >= 100) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: The total number of instructions has to be less than 100`
      )
    }

    robot.instructions = robot.instructions.toString().toUpperCase()

    const validChars = robot.instructions
      .split('')
      .every(
        (instruction) =>
          instruction == 'L' || instruction == 'R' || instruction == 'F'
      )

    if (!validChars) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Some unknown instructions where passed, follow this scheme: L (turn left), R (turn right), F (move forward)`
      )
    }

    if (robot.x > BOARD.x || robot.y > BOARD.y) {
      return handleInvalidInput(
        `[ Robot ${++idx} ]: Robot starting point shouldn't be greater than the board size`
      )
    }

    INPUT.push(robot)
  })

  function handleInvalidInput(message, statusCode = 400) {
    return next({
      success: false,
      statusCode,
      error: new Error(message),
    })
  }

  function objectKeysNormalization(obj) {
    const output = {}
    Object.keys(obj).forEach((elm) => (output[elm.toLowerCase()] = obj[elm]))
    return output
  }

  res.locals.surface = BOARD
  res.locals.INPUT = INPUT

  next()
}
