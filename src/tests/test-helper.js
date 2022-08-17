function apiTestSuite({ response, expected }) {
  expect(response.status).toEqual(expected.statusCode)
  expect(JSON.parse(response.text).success).toEqual(expected.success)

  expect(JSON.parse(response.text).missionStatistics.sentRobots).toEqual(
    expected.missionStatistics.sentRobots
  )
  expect(JSON.parse(response.text).missionStatistics.lostRobots).toEqual(
    expected.missionStatistics.lostRobots
  )
  expect(
    JSON.parse(response.text).missionStatistics.dangerousZonesIdentified
  ).toEqual(expected.missionStatistics.dangerousZonesIdentified)

  JSON.parse(response.text).missionStatistics.robotLogs.forEach(
    (robot, robotIdx) => {
      expect(robot.resume).toEqual(
        expected.missionStatistics.robotLogs[robotIdx].resume
      )
      expect(robot.robotJourney).toEqual(
        expected.missionStatistics.robotLogs[robotIdx].robotJourney
      )
    }
  )
}

module.exports = { apiTestSuite }