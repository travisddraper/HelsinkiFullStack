const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

/*beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})*/

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('New blogs without title and url are 400', async () => {
  const blogPost = {
    author: 'You',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(blogPost)
    .expect(400)
})

test('likes default to 0', async () => {
  const blogPosting = {
    title: 'Where is Earth?',
    author: 'You',
    url: 'space.com'
  }

  const postedBlog = await api
    .post('/api/blogs')
    .send(blogPosting)
    .expect(201)

  expect(postedBlog.body.likes).toEqual(0)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('id is a string named "id"', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body[0].id
  expect(contents).toBeDefined()
})

test('POST creates a new blog post', async () => {
  const blogPost = {
    title: 'Where is Earth?',
    author: 'You',
    url: 'space.com',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(blogPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlogList = await api.get('/api/blogs')

  expect(newBlogList.body).toHaveLength(helper.initialBlogs.length + 1)

  const titles = newBlogList.body.map(n => n.title)

  expect(titles).toContain('Where is Earth?')
})

test('deleting post returns a statuscode 204', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.body.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})