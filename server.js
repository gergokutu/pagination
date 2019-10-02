const express = require('express')
const app = express()

const port = process.env.PORT || 4000

// hook up the server with the db
const mongoose = require('mongoose')
const User = require('./users')
// and connect the db
mongoose.connect('mongodb://localhost/pagination',
  // next line is because of the deprecation warning
  // comment it out and you will see
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// we have an empty db
// so we have to upload it (just first time)
const db = mongoose.connection
db.once('open', async () => {
  // check if we have the User model
  // if yes » do nothing (just return)
  if (await User.countDocuments().exec() > 0) return

  // do a bunch of things inside the promise
  // and then log 'Users added' to the console
  Promise.all([
    User.create({ name: 'User 1' }),
    User.create({ name: 'User 2' }),
    User.create({ name: 'User 3' }),
    User.create({ name: 'User 4' }),
    User.create({ name: 'User 5' }),
    User.create({ name: 'User 6' }),
    User.create({ name: 'User 7' }),
    User.create({ name: 'User 8' }),
    User.create({ name: 'User 9' }),
    User.create({ name: 'User 10' }),
    User.create({ name: 'User 11' }),
    User.create({ name: 'User 12' }),
    User.create({ name: 'User 13' }),
  ]).then(() => console.log('Users added'))
})

app.get(
  '/users',
  paginatedResults(User),
  (req, res) => {
    res.json(res.paginatedResults)
  }
)

function paginatedResults(model) {
  // a middleware function always takes » request, response and next
  // so we have to return a func which takes » request, response and next
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        next: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        previous: page - 1,
        limit: limit
      }
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

app.listen(port, () => console.log(`Server listening on localhost:${port}`))