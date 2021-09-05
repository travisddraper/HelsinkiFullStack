import React, { useState } from 'react'
import blogServices from '../services/blogs'

export const MoreInfo =({ url, likes, username, updateLikes, handleDelete }) => (
  <>
    <p>url:  {url}</p>
    <p>likes:  {likes} <button onClick={updateLikes}>Like</button>
    </p>
    <p>username:  {username}</p>
    <button onClick={handleDelete}>Remove</button>
  </>
)

export const Blog = ({ blogs, blog, setBlogs }) => {
  const [showInfo, setShowInfo] = useState(false)
  let buttonLabel = !showInfo ? 'Show' : 'Hide'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = async () => {
    blog.likes += 1
    try {
      const newBlog = await blogServices
        .addLike(blog)
      setBlogs(blogs.map(blog => blog.id !== newBlog.id ? blog : newBlog ))

    } catch (exception) {
      console.log(exception)
    }
  }

  const deleteBlog = async() => {
    try {
      if(window.confirm(`Delete Blog "${blog.title}" by ${blog.author.name}?`)) {
        const token = `bearer ${JSON.parse(window.localStorage.getItem('loggedBlogAppUser')).token}`
        await blogServices
          .removeBlog(blog.id, token)

        setBlogs(blogs.filter(newBlog => newBlog.id !== blog.id))
      }
    } catch (exception) {
      console.log(exception)
    }

  }

  return (
    <div style={blogStyle} className="blogDiv">
      <ul className="blog">
        {blog.title} by {blog.author.name}
        <button onClick={() => setShowInfo(!showInfo)}>{buttonLabel}</button>
        {!showInfo
          ?  null
          : <MoreInfo
            url={blog.url}
            likes={blog.likes}
            username={blog.author.username}
            updateLikes={updateLikes}
            handleDelete={deleteBlog}
          />
        }
      </ul>
    </div>

  )
}


const Blogs = ({ blogs, setBlogs }) => {

  return (
    <div>
      <h2>Blogs</h2>

      <div className="blogs">
        {blogs.sort((a, b) => b.likes - a.likes).map(blog => {
          return <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs}/>
        })}
      </div>
    </div>
  )
}

export default Blogs