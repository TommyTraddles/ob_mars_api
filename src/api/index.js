const router = require('express').Router()
const validator = require('../middlewares/validate-input')

module.exports = (db) => {
  router.post('/', validator, require('./post-mission')(db))

  return router
}
