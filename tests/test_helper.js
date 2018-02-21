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



module.exports = {
    initialBlogs, blogsInDb
  }