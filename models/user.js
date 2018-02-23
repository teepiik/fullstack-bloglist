const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: String,
  name: String,
  adult: Boolean,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

module.exports = User