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