module.exports = ({ statusCode = 500, error }, req, res, next) => {
  res.status(statusCode).json({
    success: false,
    message: error.message,
  })
}
