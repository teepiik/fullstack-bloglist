const blogRouter = require('express').Router()
const Blog = require('../models/blog')

/*
blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})*/


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body


  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }


  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = new Blog(request.body)

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

/*
blogRouter.post('/', (request, response) => {

  
  if (request.body.url === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog(request.body)

  if(blog.likes===undefined) {
    blog.likes = 0
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})*/

blogRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
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
    response.json(blog) // bad, should use callback updated blog

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'bad id' })
  }

})

module.exports = blogRouter