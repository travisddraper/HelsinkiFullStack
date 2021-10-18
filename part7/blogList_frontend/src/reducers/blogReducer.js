export const createBlog = newBlog => {
  return {
    type: 'NEW_BLOG',
    data: newBlog
  }
}

export const setBlogs = (blogs) => {
  return {
    type: 'BLOG_INIT',
    data: blogs
  }
}

export const removeBlog = (id) => {
  return {
    type: 'DELETE_BLOG',
    data: { id }
  }
}

export const likeBlog = (blog) => {
  return {
    type: 'LIKE_BLOG',
    data: blog
  }
}







const blogReducer = (state = [], action) => {
  switch(action.type) {
  case 'BLOG_INIT': {
    return action.data || state
  }
  case 'NEW_BLOG': {
    return state.concat(action.data)
  }
  case 'LIKE_BLOG': {
    const blogLiked = action.data
    return state.map(blog => blog.id !== blogLiked.id ? blog : blogLiked )
  }
  case 'DELETE_BLOG': {
    const id = action.data.id
    return state.filter(blog => blog.id !== id)
  }
  default: {
    return state
  }
  }
}




export default blogReducer