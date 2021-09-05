import React, { useState } from 'react'

const BlogForm = ({ author, handleSubmit }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      url: url
    }
    handleSubmit(blogObject)
    setTitle('')
    setUrl('')
  }

  return (
    <div className="blogFormDiv">
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            className="blogFormTitle"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:  {author}
        </div>
        <div>
          url:
          <input
            className="blogFormUrl"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  )
}

export default BlogForm