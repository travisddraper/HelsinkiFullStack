const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('comments', { comment: 1 } ).populate('author', { username: 1 } )

  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if(!body.title || !body.url) {
    response.status(400).end()
    return
  }

  const blog = new Blog({
    title: body.title,
    author: request.user._id,
    url: body.url,
    likes: body.likes || 0,
    date: new Date()
  })

  const savedBlog = await ( await blog.save() ).populate('author').execPopulate()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async(request, response) => {
  const body = request.body
  const id = request.params.id
  const comment = new Comment({
    comment: body.comment,
    date: new Date(),
    blog_id: id
  })
  const savedComment = await comment.save()

  const blog = await Blog.findById(id)
  blog.comments = blog.comments
    ? blog.comments.concat(savedComment._id)
    : savedComment._id
  await blog.save()

  response.status(201).json(savedComment)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete.author.toString() === request.user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Invalid token. Only original creator may delete post' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = { ...request.body }

  const blogToUpdate = {
    user: blog.author.id,
    likes: blog.likes,
    title: blog.title,
    url: blog.url
  }

  console.log('blog', blog)
  console.log('blogToUpdate', blogToUpdate)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true }).populate('author', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter