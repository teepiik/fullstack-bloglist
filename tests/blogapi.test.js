const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb, titlesInDb, newBlogsId } = require('./test_helper')

describe('API tests', async () => {

    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(blog => new Blog(blog))
        await Promise.all(blogObjects.map(blog => blog.save()))
    })

    describe('GET all operations', async () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all blogs are returned', async () => {
            const blogsInDatabase = await blogsInDb()

            const response = await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            expect(response.body.length).toBe(blogsInDatabase.length)

        })

        test('a specific blog is within the returned blogs', async () => {
            const response = await api
                .get('/api/blogs')

            const titles = response.body.map(r => r.title)

            expect(titles).toContain('Bingo')
        })

    })


    describe('POST, adding a new blog', async () => {
        test('adding a new blog ', async () => {
            const blogsAtStart = await blogsInDb()

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

            expect(response.body.length).toBe(blogsAtStart.length + 1)
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

    })

    describe('Deleting a blog', async () => {
        test('a blog is deleted', async () => {

            const newId = await newBlogsId()
            const blogtitlesAtStart = await titlesInDb()
            expect(blogtitlesAtStart).toContain('Test with id')
            // titles contains a --> delete a --> titles.not.contain a

            await api
                .delete(`/api/blogs/${newId}`)
                .send()
                .expect(204) // no content


            const response = await api
                .get('/api/blogs')

            const titles = response.body.map(r => r.title)
            expect(titles).not.toContain('Test with id')

        })


    })

    describe('Updating a blog', async () => {
        test('A blog title is updated', async () => {

            const newId = await newBlogsId()
            const blogtitlesAtStart = await titlesInDb()
            expect(blogtitlesAtStart).not.toContain('Updated')
            // titles.not.contains a.title --> update a.title --> titles contain a.title

            const updatedBlog = {
                title: 'Updated',
                author: 'Tester',
                url: 'www.adder.com',
                likes: 23
            }

            await api
                .put(`/api/blogs/${newId}`)
                .send(updatedBlog)
                .expect(200)


            const response = await api
                .get('/api/blogs')

            const titles = response.body.map(r => r.title)
            expect(titles).toContain('Updated')

        })


    })

    afterAll(() => {
        server.close()
    })

})