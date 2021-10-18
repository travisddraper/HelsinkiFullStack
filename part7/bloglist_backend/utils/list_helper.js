const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if(blogs.length === 0) { return 'No entries' }
  let bestBlog = {}

  blogs.forEach(blog => {
    if (!bestBlog.likes || blog.likes > bestBlog.likes) {
      bestBlog = blog
    }
  })

  return {
    title: bestBlog.title,
    author: bestBlog.author,
    likes: bestBlog.likes
  }
}

const mostBlogs = (blogs, valueString) => {
  if(blogs.length === 0) { return 'No entries' }

  let authorsAndBlogs = []

  blogs.forEach(blog => {
    const match = authorsAndBlogs.find(authorBlog => authorBlog.author === blog.author)
    if(match) {
      if(valueString === 'blogs') {
        match[valueString] += 1
      } else {
        match[valueString] += blog[valueString]
      }
    } else {
      let authorBlog = {
        author: blog.author,
        [valueString]: blog[valueString] || 1
      }

      authorsAndBlogs.push(authorBlog)
    }
  })

  let mostPopular = {}

  authorsAndBlogs.forEach(blog => {
    if(!mostPopular[valueString] || blog[valueString] > mostPopular[valueString]) {
      mostPopular = blog
    }
  })
  return mostPopular
}

/*const mostLikes = (blogs) => {
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  PLEASE SEE ABOVE FUNCTION FOR THE COMBINED SOLUTION TO 4.6* AND 4.7*
 I COMBINED THIS FUNCTION WITH THE PREVIOUS mostBlogs FUNCTION AS IT SEEMED SIMPLER

}*/

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}