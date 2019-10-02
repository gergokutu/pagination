// schema for mongodb
const mongoose = require('mongoose')

// define a schema
const userSchema = new mongoose.Schema({
  // only name because id is automatically generated
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)