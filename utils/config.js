if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  let port = process.env.PORT
  let mongoUrl = process.env.BLOGLISTDB_URI
  
  if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.BLOGLISTTESTDB_URI
  }
  
  module.exports = {
    mongoUrl,
    port
  }