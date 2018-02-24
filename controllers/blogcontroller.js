const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user' ,{ id:1, username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }


    if (body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    /*
    const user = await User.findById(body.userId)
    */
    const users = await User.find({})
    const user = users[0]

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

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog)) // ?????
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
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