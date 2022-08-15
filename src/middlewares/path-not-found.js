module.exports = (req, res, next) => {
  next({
    statusCode: 404,
    error: new Error('path not found'),
  })
}
