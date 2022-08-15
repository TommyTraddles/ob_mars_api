const router = require('express').Router()

module.exports = (db) => {
  router.post('/', (req, res, next) => {
    res.json({
      success: true,
      message: 'hello',
    })
  })

  return router
}
