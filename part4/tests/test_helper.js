const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Hello World',
    author: 'Travis',
    url: 'helloWorld.com',
    likes: 0
  },
  {
    title: 'Goodbye World',
    author: 'Some Sad Guy',
    url: 'ohno.com',
    likes: 2
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs,
  usersInDb
}