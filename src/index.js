console.clear()
require('dotenv').config()

const express = require('express')
const db = require('./config/database')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(require('./api')(db))
app.use(require('./middlewares/path-not-found'))
app.use(require('./middlewares/error-handler'))

if (process.env.NODE_ENV !== 'test')
  app.listen(process.env.PORT || 3000, () => {
    console.log('✅ New mission started')
  })

module.exports = { app }
