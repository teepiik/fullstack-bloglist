const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalLikes = 0
    blogs.forEach(blog => {
        totalLikes = totalLikes + blog.likes
    });

    return totalLikes
}

const favoriteBlog = (blogs) => {
    let best = {
        likes: 0
    }

    blogs.forEach(blog => {
        if(best.likes<=blog.likes)
        best = blog
    });

    const bestReturn = {
        title: best.title,
        author: best.author,
        likes: best.likes
    }

    return bestReturn
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}