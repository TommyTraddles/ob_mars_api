require('dotenv').config()
const slonik = require('slonik')

const slonikURL = process.env.DEV_DB_URL

const db = slonik.createPool(slonikURL)

module.exports = db
