import React, { useState } from 'react'
import { Form, Button, FormControl } from 'react-bootstrap'

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
      <Form onSubmit={addBlog}>
        <Form.Group>
          <div>
          title:
            <FormControl
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
            <FormControl
              className="blogFormUrl"
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <Button type="submit">Post</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm