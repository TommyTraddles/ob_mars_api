const { apiTestSuite } = require('./test-helper')
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
  test('Given the brief sample intput, should return the given sample output', async () => {
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
        surfaceDimentions: [5, 3],
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
            totalExploredSurface: '4 m2 | 26%',
            resume: { position: [1, 1], compass: 'E', lost: false },
            robotJourney: [
              { step: 0, x: 1, y: 1, lost_signal: false, compass: 'E' },
              { step: 1, x: 1, y: 1, lost_signal: false, compass: 'S' },
              { step: 2, x: 1, y: 0, lost_signal: false, compass: 'S' },
              { step: 3, x: 1, y: 0, lost_signal: false, compass: 'W' },
              { step: 4, x: 0, y: 0, lost_signal: false, compass: 'W' },
              { step: 5, x: 0, y: 0, lost_signal: false, compass: 'N' },
              { step: 6, x: 0, y: 1, lost_signal: false, compass: 'N' },
              { step: 7, x: 0, y: 1, lost_signal: false, compass: 'E' },
              { step: 8, x: 1, y: 1, lost_signal: false, compass: 'E' },
            ],
          },
          {
            totalExploredSurface: '2 m2 | 13%',
            resume: { position: [3, 3], compass: 'N', lost: true },
            robotJourney: [
              { step: 0, x: 3, y: 2, lost_signal: false, compass: 'N' },
              { step: 1, x: 3, y: 3, lost_signal: false, compass: 'N' },
              { step: 2, x: 3, y: 3, lost_signal: false, compass: 'E' },
              { step: 3, x: 3, y: 3, lost_signal: false, compass: 'S' },
              { step: 4, x: 3, y: 2, lost_signal: false, compass: 'S' },
              { step: 5, x: 3, y: 2, lost_signal: false, compass: 'E' },
              { step: 6, x: 3, y: 2, lost_signal: false, compass: 'N' },
              { step: 7, x: 3, y: 3, lost_signal: true, compass: 'N' },
            ],
          },
          {
            totalExploredSurface: '6 m2 | 40%',
            resume: { position: [4, 2], compass: 'N', lost: false },
            robotJourney: [
              { step: 0, x: 0, y: 3, lost_signal: false, compass: 'W' },
              { step: 1, x: 0, y: 3, lost_signal: false, compass: 'S' },
              { step: 2, x: 0, y: 3, lost_signal: false, compass: 'E' },
              { step: 3, x: 1, y: 3, lost_signal: false, compass: 'E' },
              { step: 4, x: 2, y: 3, lost_signal: false, compass: 'E' },
              { step: 5, x: 3, y: 3, lost_signal: false, compass: 'E' },
              { step: 6, x: 3, y: 3, lost_signal: false, compass: 'S' },
              { step: 7, x: 3, y: 2, lost_signal: false, compass: 'S' },
              { step: 8, x: 3, y: 2, lost_signal: false, compass: 'E' },
              { step: 9, x: 4, y: 2, lost_signal: false, compass: 'E' },
              { step: 10, x: 4, y: 2, lost_signal: false, compass: 'N' },
            ],
          },
        ],
      },
    }

    const response = await api.post('/').send(received)
    apiTestSuite({ response, expected })
  })

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
        dangerousZonesIdentified: [],
        robotLogs: [
          {
            resume: { position: [1, 1], compass: 'E', lost: false },
            robotJourney: [
              { step: 0, x: 1, y: 1, compass: 'E', lost_signal: false },
              { step: 1, x: 1, y: 1, compass: 'S', lost_signal: false },
              { step: 2, x: 1, y: 0, compass: 'S', lost_signal: false },
              { step: 3, x: 1, y: 0, compass: 'W', lost_signal: false },
              { step: 4, x: 0, y: 0, compass: 'W', lost_signal: false },
              { step: 5, x: 0, y: 0, compass: 'N', lost_signal: false },
              { step: 6, x: 0, y: 1, compass: 'N', lost_signal: false },
              { step: 7, x: 0, y: 1, compass: 'E', lost_signal: false },
              { step: 8, x: 1, y: 1, compass: 'E', lost_signal: false },
            ],
          },
        ],
      },
    }

    const response = await api.post('/').send(received)
    apiTestSuite({ response, expected })
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
        dangerousZonesIdentified: [{ x: 3, y: 3, compass: 'N' }],
        robotLogs: [
          {
            resume: { position: [3, 3], compass: 'N', lost: true },
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 1, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 2, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 3, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 4, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 5, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 6, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 7, x: 3, y: 3, compass: 'N', lost_signal: true },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTestSuite({ response, expected })
  })

  test('After a robot gets lost, the following robots should not get lost at the same place', async () => {
    const received = {
      surface: { x: 5, y: 3 },
      robots: [
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 3, y: 2, compass: 'N', instructions: 'FRRFLLFFRRFLL' },
        { x: 3, y: 3, compass: 'N', instructions: 'FFFFFFFFFFFF' },
      ],
    }
    const expected = {
      statusCode: 200,
      success: true,
      missionStatistics: {
        sentRobots: 4,
        lostRobots: 1,
        dangerousZonesIdentified: [{ x: 3, y: 3, compass: 'N' }],
        robotLogs: [
          {
            resume: { position: [3, 3], compass: 'N', lost: true },
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 1, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 2, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 3, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 4, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 5, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 6, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 7, x: 3, y: 3, compass: 'N', lost_signal: true },
            ],
          },
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 1, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 2, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 3, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 4, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 5, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 6, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 7, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 9, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 10, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 11, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 12, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 13, x: 3, y: 2, compass: 'N', lost_signal: false },
            ],
          },
          {
            resume: { position: [3, 2], compass: 'N', lost: false },
            robotJourney: [
              { step: 0, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 1, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 2, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 3, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 4, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 5, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 6, x: 3, y: 2, compass: 'N', lost_signal: false },
              { step: 7, x: 3, y: 3, compass: 'N', lost_signal: false },
              { step: 9, x: 3, y: 3, compass: 'E', lost_signal: false },
              { step: 10, x: 3, y: 3, compass: 'S', lost_signal: false },
              { step: 11, x: 3, y: 2, compass: 'S', lost_signal: false },
              { step: 12, x: 3, y: 2, compass: 'E', lost_signal: false },
              { step: 13, x: 3, y: 2, compass: 'N', lost_signal: false },
            ],
          },
          {
            resume: { position: [3, 3], compass: 'N', lost: false },
            robotJourney: [
              { step: 0, x: 3, y: 3, compass: 'N', lost_signal: false },
            ],
          },
        ],
      },
    }
    const response = await api.post('/').send(received)
    apiTestSuite({ response, expected })
  })
})
