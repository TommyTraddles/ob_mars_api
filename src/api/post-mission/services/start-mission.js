const {
  insertMission,
  insertSurface,
  searchExistingSurface,
} = require('../queries/start-mission-queries')

async function startMission(db, { x, y }) {
  try {
    const missionId = await insertMission(db)
    const { id } = missionId.rows[0]

    await insertSurface(db, { x, y, id })

    const { rows } = await searchExistingSurface(db, { x, y, id })
    return rows[0]
  } catch (error) {
    console.info(`> ❌ Error at [ startMission ] query: ${error.message}`)
    return false
  }
}

module.exports = {
  startMission,
}
