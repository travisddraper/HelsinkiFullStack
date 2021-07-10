const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('user with invalid credentials not created, returns code 401', async () => {
  const usersAtStart = await helper.usersInDb()

  const badUser = {
    username: 'TraTraTra',
    name: 'Travis Draper',
    password:'cd'
  }

  const failedAttempt = await api
    .post('/api/users')
    .send(badUser)
    .expect(401)

  expect(failedAttempt.text).toContain('Invalid password')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).not.toContain(badUser.username)
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'Travis',
    name: 'Travis Draper',
    password: 'travis',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})



afterAll(() => {
  mongoose.connection.close()
})