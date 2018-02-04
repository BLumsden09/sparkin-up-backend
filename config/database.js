const crypto = require('crypto').randomBytes(256).toString('hex') //built-in package

module.exports = {
  uri: 'mongodb://localhost:27017/sparkinup',
  secret: crypto,
  db: 'sparkinup'
}