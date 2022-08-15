const { app } = require('../index')
const api = require('supertest')(app)

describe('POST / [Endpoint availability]', () => {
  test('API should be operative', async () => {
    const received = {
      surface: { X: 5, Y: 3 },
      robots: [{ X: 1, Y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 200,
      success: true,
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
  })
})

describe('POST / [Input validation and sanitization]', () => {
  test('Passing and empty object should return a Bad Request error', async () => {
    const received = {}
    const expected = {
      statusCode: 400,
      success: false,
      message:
        'Missing both Surface coordinates to render the map, follow this schema: { surface: { X: number, Y: number }}',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Missing "surface".x should return a Bad Request error', async () => {
    const received = {
      surface: { y: 3 },
      robots: [{ x: 1, y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message: 'Missing one or the two coordinates needed to render the map',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Passing "surface".x values lesser than 2 should return a Bad Request error', async () => {
    const received = {
      surface: { x: 1, y: 1 },
      robots: [{ x: 1, y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message: 'The surface coordinate values must be between 1 and 50',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Passing "surface".x values greater than 50 should return a Bad Request error', async () => {
    const received = {
      surface: { x: 51, y: 2 },
      robots: [{ x: 1, y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message: 'The surface coordinate values must be between 1 and 50',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('An empty "robots" array should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        'Define at least 1 robot for your mission, follow this schema: robots: [{X: number, Y: number, compass: string, instructions: string }]',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Missing "robots".x should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        '[ Robot 1 ]: Missing one or the two coordinates needed to place the robot within the map, follow this schema: X: number, Y: number ',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Missing "robots".compass should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 1, y: 1, instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        '[ Robot 1 ]: Missing the starting cardinal direction to place the robot within the map, use this scheme: N (north), E (east), S (south), W (west)',
    }

    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Passing and incorrect "robots".compass value should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 1, y: 1, compass: 'X', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        '[ Robot 1 ]: Missing the starting cardinal direction to place the robot within the map, use this scheme: N (north), E (east), S (south), W (west)',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Missing "robots".instruction should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 1, y: 1, compass: 'E' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        '[ Robot 1 ]: Missing the set of instructions the robot will follow in its journey',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Passing and incorrect "robots".instruction value should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 1, y: 1, compass: 'E', instructions: 'AZAFATA' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        '[ Robot 1 ]: Some unknown instructions where passed, follow this scheme: L (turn left), R (turn right), F (move forward)',
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })

  test('Passing greater robots.x value than the surface.x value should return a Bad Request error', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 6, y: 5, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 400,
      success: false,
      message:
        "[ Robot 1 ]: Robot starting point shouldn't be greater than the board size",
    }
    const response = await api.post('/').send(received)
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
    expect(JSON.parse(response.text).message).toEqual(expected.message)
  })
})

describe('POST / [Mission Queries]', () => {
  // mission info

  test('If the robot stays within the surface area should return a successful response', async () => {
    const received = {
      surface: { x: 3, y: 5 },
      robots: [{ x: 1, y: 1, compass: 'E', instructions: 'RFRFRFRF' }],
    }
    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 1,
        lostRobots: 0,
        surfaceTotalArea: '15 m2',
        totalExploredSurface: '4 m2 | 26%',
        exploredSurface: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ],
        dangerousZonesIdentified: [],
        robotLogs: [
          {
            resume: { position: [1, 1], compass: 'E', lost: false },
            totalExploredSurface: '4 m2 | 26%',
            robotJourney: [
              { step: 0, x: 1, y: 1, compass: 'E' },
              { step: 1, x: 1, y: 1, compass: 'S' },
              { step: 2, x: 1, y: 0, compass: 'S' },
              { step: 3, x: 1, y: 0, compass: 'W' },
              { step: 4, x: 0, y: 0, compass: 'W' },
              { step: 5, x: 0, y: 0, compass: 'N' },
              { step: 6, x: 0, y: 1, compass: 'N' },
              { step: 7, x: 0, y: 1, compass: 'E' },
            ],
          },
        ],
      },
    }

    const response = await api.post('/').send(received)
    apiTester({ response, expected })
  })

  test('If the robot lands outside the surface area, it should return the robot as lost', async () => {
    const received = {
      surface: { x: 5, y: 3 },
      robots: [{ x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' }],
    }
    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 1,
        lostRobots: 1,
        surfaceTotalArea: '15 m2',
        totalExploredSurface: '2 m2 | 13%',
        exploredSurface: [
          { x: 3, y: 2 },
          { x: 3, y: 3 },
        ],
        dangerousZonesIdentified: [{ x: 3, y: 3, compass: 'N' }],
        robotLogs: [
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '3 m2 | 20%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 7, x: 3, y: 3, compass: 'N' },
              { step: 8, x: 3, y: 4, compass: 'N' },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTester({ response, expected })
  })

  test('After a robot gets lost, teh following robot should not get lost at the same place', async () => {
    const received = {
      surface: { x: 5, y: 3 },
      robots: [
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
      ],
    }
    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 2,
        lostRobots: 1,
        surfaceTotalArea: '15 m2',
        totalExploredSurface: '2 m2 | 13%',
        exploredSurface: [
          { x: 3, y: 2 },
          { x: 3, y: 3 },
        ],
        dangerousZonesIdentified: [{ x: 3, y: 3, compass: 'N' }],
        robotLogs: [
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '3 m2 | 20%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 7, x: 3, y: 3, compass: 'N' },
              { step: 8, x: 3, y: 4, compass: 'N' },
            ],
          },
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '2 m2 | 13%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 8, x: 3, y: 3, compass: 'N' },
              { step: 9, x: 3, y: 3, compass: 'E' },
              { step: 10, x: 3, y: 3, compass: 'S' },
              { step: 11, x: 3, y: 2, compass: 'S' },
              { step: 12, x: 3, y: 2, compass: 'E' },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTester({ response, expected })
  })

  test('Passing 3 robots should log the mission global statistics', async () => {
    const received = {
      surface: { x: 5, y: 3 },
      robots: [
        { x: 1, y: 1, compass: 'E', instructions: 'RFRFRFRF' },
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 0, y: 3, compass: 'W', instructions: 'LLFFFRFLFL' },
      ],
    }
    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 3,
        lostRobots: 1,
        surfaceTotalArea: '15 m2',
        totalExploredSurface: '10 m2 | 66%',
        exploredSurface: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: 3 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 3 },
          { x: 2, y: 3 },
          { x: 3, y: 2 },
          { x: 3, y: 3 },
          { x: 4, y: 2 },
        ],
        dangerousZonesIdentified: [{ x: 3, y: 3, compass: 'N' }],
        robotLogs: [
          {
            resume: { position: [1, 1], compass: 'E', lost: false },
            totalExploredSurface: '4 m2 | 26%',
            robotJourney: [
              { step: 0, x: 1, y: 1, compass: 'E' },
              { step: 1, x: 1, y: 1, compass: 'S' },
              { step: 2, x: 1, y: 0, compass: 'S' },
              { step: 3, x: 1, y: 0, compass: 'W' },
              { step: 4, x: 0, y: 0, compass: 'W' },
              { step: 5, x: 0, y: 0, compass: 'N' },
              { step: 6, x: 0, y: 1, compass: 'N' },
              { step: 7, x: 0, y: 1, compass: 'E' },
            ],
          },
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '3 m2 | 20%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 7, x: 3, y: 3, compass: 'N' },
              { step: 8, x: 3, y: 4, compass: 'N' },
            ],
          },
          {
            resume: { position: [0, 3], compass: 'W', lost: false },
            totalExploredSurface: '6 m2 | 40%',
            robotJourney: [
              { step: 0, x: 0, y: 3, compass: 'W' },
              { step: 1, x: 0, y: 3, compass: 'S' },
              { step: 2, x: 0, y: 3, compass: 'E' },
              { step: 3, x: 1, y: 3, compass: 'E' },
              { step: 4, x: 2, y: 3, compass: 'E' },
              { step: 5, x: 3, y: 3, compass: 'E' },
              { step: 6, x: 3, y: 3, compass: 'S' },
              { step: 7, x: 3, y: 2, compass: 'S' },
              { step: 8, x: 3, y: 2, compass: 'E' },
              { step: 9, x: 4, y: 2, compass: 'E' },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTester({ response, expected })
  })

  test('Passing 5 robots should return a complete log of the mission', async () => {
    const received = {
      surface: { x: 5, y: 3 },
      robots: [
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFFRRFLL' },
        { x: 0, y: 0, compass: 'E', instructions: 'FFFFFFFFFFF' },
        { x: 0, y: 0, compass: 'E', instructions: 'FFFFFFFFFFFRRFFFFFRFF' },
        { x: 5, y: 3, compass: 'E', instructions: 'FFFFFFFFFFFRRFFFFFRFF' },
      ],
    }

    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 5,
        lostRobots: 3,
        surfaceTotalArea: '15 m2',
        totalExploredSurface: '10 m2 | 66%',
        exploredSurface: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 3, y: 2 },
          { x: 3, y: 3 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 5, y: 3 },
        ],
        dangerousZonesIdentified: [
          { x: 3, y: 3, compass: 'N' },
          { x: 5, y: 0, compass: 'E' },
          { x: 5, y: 3, compass: 'E' },
        ],
        robotLogs: [
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '3 m2 | 20%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 7, x: 3, y: 3, compass: 'N' },
              { step: 8, x: 3, y: 4, compass: 'N' },
            ],
          },
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            totalExploredSurface: '2 m2 | 13%',
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N' },
              { step: 1, x: 3, y: 3, compass: 'N' },
              { step: 2, x: 3, y: 3, compass: 'E' },
              { step: 3, x: 3, y: 3, compass: 'S' },
              { step: 4, x: 3, y: 2, compass: 'S' },
              { step: 5, x: 3, y: 2, compass: 'E' },
              { step: 6, x: 3, y: 2, compass: 'N' },
              { step: 9, x: 3, y: 3, compass: 'N' },
              { step: 10, x: 3, y: 3, compass: 'E' },
              { step: 11, x: 3, y: 3, compass: 'S' },
              { step: 12, x: 3, y: 2, compass: 'S' },
              { step: 13, x: 3, y: 2, compass: 'E' },
            ],
          },
          {
            resume: { position: [0, 0], compass: 'E', lost: false },
            totalExploredSurface: '6 m2 | 40%',
            robotJourney: [
              { step: 0, x: 0, y: 0, compass: 'E' },
              { step: 1, x: 1, y: 0, compass: 'E' },
              { step: 2, x: 2, y: 0, compass: 'E' },
              { step: 3, x: 3, y: 0, compass: 'E' },
              { step: 4, x: 4, y: 0, compass: 'E' },
              { step: 5, x: 5, y: 0, compass: 'E' },
              { step: 6, x: 6, y: 0, compass: 'E' },
            ],
          },
          {
            resume: { position: [0, 0], compass: 'E', lost: false },
            totalExploredSurface: '7 m2 | 46%',
            robotJourney: [
              { step: 0, x: 0, y: 0, compass: 'E' },
              { step: 1, x: 1, y: 0, compass: 'E' },
              { step: 2, x: 2, y: 0, compass: 'E' },
              { step: 3, x: 3, y: 0, compass: 'E' },
              { step: 4, x: 4, y: 0, compass: 'E' },
              { step: 11, x: 5, y: 0, compass: 'E' },
              { step: 12, x: 5, y: 0, compass: 'S' },
              { step: 13, x: 5, y: 0, compass: 'W' },
              { step: 14, x: 4, y: 0, compass: 'W' },
              { step: 15, x: 3, y: 0, compass: 'W' },
              { step: 16, x: 2, y: 0, compass: 'W' },
              { step: 17, x: 1, y: 0, compass: 'W' },
              { step: 18, x: 0, y: 0, compass: 'W' },
              { step: 19, x: 0, y: 0, compass: 'N' },
              { step: 20, x: 0, y: 1, compass: 'N' },
            ],
          },
          {
            resume: { position: [5, 3], compass: 'E', lost: false },
            totalExploredSurface: '1 m2 | 6%',
            robotJourney: [
              { step: 0, x: 5, y: 3, compass: 'E' },
              { step: 1, x: 6, y: 3, compass: 'E' },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTester({ response, expected })
  })
})

function apiTester({ response, expected }) {
  // api availability
  expect(response.status).toEqual(expected.statusCode)
  expect(JSON.parse(response.text).success).toEqual(expected.success)

  // mission information
  expect(JSON.parse(response.text).missionStatistics.sentRobots).toEqual(
    expected.missionStatistics.sentRobots
  )
  expect(JSON.parse(response.text).missionStatistics.lostRobots).toEqual(
    expected.missionStatistics.lostRobots
  )
  expect(JSON.parse(response.text).missionStatistics.surfaceTotalArea).toEqual(
    expected.missionStatistics.surfaceTotalArea
  )
  expect(
    JSON.parse(response.text).missionStatistics.totalExploredSurface
  ).toEqual(expected.missionStatistics.totalExploredSurface)
  expect(
    JSON.parse(response.text).missionStatistics.dangerousZonesIdentified
  ).toEqual(expected.missionStatistics.dangerousZonesIdentified)

  // robots logs
  JSON.parse(response.text).missionStatistics.robotLogs.forEach(
    (robot, robotIdx) => {
      expect(robot.resume).toEqual(
        expected.missionStatistics.robotLogs[robotIdx].resume
      )
      expect(robot.totalExploredSurface).toEqual(
        expected.missionStatistics.robotLogs[robotIdx].totalExploredSurface
      )
      // robot
      robot.robotJourney.forEach((log, logIdx) => {
        expect(log.step).toEqual(
          expected.missionStatistics.robotLogs[robotIdx].robotJourney[logIdx]
            .step
        )
        expect(log.x).toEqual(
          expected.missionStatistics.robotLogs[robotIdx].robotJourney[logIdx].x
        )
        expect(log.y).toEqual(
          expected.missionStatistics.robotLogs[robotIdx].robotJourney[logIdx].y
        )
        expect(log.compass).toEqual(
          expected.missionStatistics.robotLogs[robotIdx].robotJourney[logIdx]
            .compass
        )
      })
    }
  )
}
