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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs
}


const titlesInDb = async () => {
    const blogs = await Blog.find({})
    console.log(blogs)
    const titles = blogs.map(blog => blog.title)
    return titles
}

const newBlogsId = async () => {
    const testBlog = {
        title: 'Test with id',
        author: 'Test',
        url: 'www.test.fi',
        likes: 0
    }
    const blog = new Blog(testBlog)
    await blog.save()  
    return blog._id.toString()
  }



module.exports = {
    initialBlogs, blogsInDb, titlesInDb, newBlogsId
  }