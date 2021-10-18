import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import axios from 'axios'

const BlogView = ({ addLike }) => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const source = axios.CancelToken.source()
    const asyncFunction = async() => {
      const blogPick = await blogService.getBlog(id, source.token)
      setBlog(blogPick)
    }
    try {
      asyncFunction()
    } catch(e) {
      console.log(e.message)
    }

    return () => {source.cancel()}
  }, [])

  const addComment = async (e) => {
    e.preventDefault()
    try {
      const savedComment = await blogService.addComment(comment, id)
      if(savedComment) {
        const newBlog = {
          ...blog,
          comments: blog.comments.concat(savedComment)
        }
        setComment('')
        setBlog(newBlog)
      }
    } catch (e) {
      console.log(e.message)
    }

  }
  return (
    <div className="blogView">
      {blog &&
      <>
        <h1>{blog.title}</h1>
        <a href={blog.url} rel="noreferrer" target="_blank">{blog.url}</a> <br/>
        {blog.likes} likes <button onClick={() => addLike(blog)}>Like</button>
        <p>added by {blog.author.username}</p>
        <h3>Comments</h3>
        <form onSubmit={addComment}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map(comment => {
            console.log(comment)
            return <li key={comment.id}>{comment.comment}</li>
          })}
        </ul>
      </>
      }
    </div>
  )
}

export default BlogView