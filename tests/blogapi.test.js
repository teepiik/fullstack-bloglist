const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'About me',
        author: "testAu",
        url: 'www.badabing.com',
        likes: 3
    },
    {
        title: 'Bingo',
        author: 'Bingo',
        url: 'www.url.fi',
        likes: 0
    }
]

beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api
        .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api
        .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain('Bingo')
})

test('adding a new blog ', async () => {
    const newBlog = {
        title: 'TestAdd',
        author: 'Tester',
        url: 'www.adder.com',
        likes: 23
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // 201 = created
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('TestAdd')
})

test('undefined likes are set to zero', async () => {
    const newBlog = {
        title: 'TestAdd',
        author: 'Tester',
        url: 'www.adder.com',
        likes: undefined
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // 201 = created
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')

    const likes = response.body.map(r => r.likes)

    expect(likes).not.toContain(undefined)
})

test('bad request if title is not given on post blog', async () => {
    const newBlog = {
        author: 'Tester',
        url: 'www.adder.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400) // Bad request
})

test('bad request if url is not given on post blog', async () => {
    const newBlog = {
        title: 'adder',
        author: 'Tester',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400) // Bad request
})

afterAll(() => {
    server.close()
})