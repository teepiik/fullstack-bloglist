const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '88888888888',
            title: 'kirja',
            author: 'alpha',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 4,
            __v: 0
        },
        {
            _id: '123',
            title: 'Most liked book',
            author: 'omega',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10,
            __v: 0
        },
    ]

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const control = {
            title:'Go To Statement Considered Harmful',
            author:'Edsger W. Dijkstra',
            likes: 5
        }
        expect(result).toEqual(control)
    })

    test('the most likes from three blogs is correct', () => {
        const result = listHelper.favoriteBlog(listWithThreeBlogs)
        const control = {
            title:'Most liked book',
            author:'omega',
            likes: 10
        }
        expect(result).toEqual(control)
    })

    test('empty list is zero', () => {
        const empty = []
        const result = listHelper.favoriteBlog(empty)
        expect(result.likes).toBe(0)
    })
})