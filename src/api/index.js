const router = require('express').Router()
const validator = require('../middlewares/validate-input')

module.exports = (db) => {
  router.post('/', validator, (req, res, next) => {
    res.json({
      success: true,
      message: 'hello',
    })
  })

  return router
}
