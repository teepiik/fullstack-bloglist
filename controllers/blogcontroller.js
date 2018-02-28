const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { id: 1, username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }


    if (body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }



    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    if (blog.likes === undefined) {
      blog.likes = 0
    }

    if (blog.user === undefined) {
      user = null
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog)) // ?????
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})


blogRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(Blog.format(blog))
    } else {
      'väärä id'
      console.log()
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'bad id' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blogToDel = await Blog.findById(request.params.id)

    if (blogToDel.user.toString() !== user.id.toString() && blogToDel.user !== null) {
      return response.status(401).json({ error: 'no permission' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'bad id' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  // Need to validate later
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(Blog.format(blog)) // bad, should use callback updated blog

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'bad id' })
  }

})

module.exports = blogRouter