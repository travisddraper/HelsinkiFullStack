const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.get('/:id', async(request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', { title: 1 })
  response.send(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = (!body.password || body.password.length < 3)
    ? false
    : await bcrypt.hash(body.password, saltRounds)


  if (!passwordHash) return response.status(401).json({ error: 'Invalid password' }).end()

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter