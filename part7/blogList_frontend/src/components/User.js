import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPage = () => {
  const { id } = useParams()
  const user = useSelector(state => state.users.find(user => user.id === id))
  if(!user) return null
  const { blogs } = user

  return (
    <div className="userView">
      <h1>{user.username}</h1>
      <h3>Added Blogs</h3>
      <ul>
        {blogs.map(blog => {
          return <li key={blog.id}>{blog.title}</li>
        })}
      </ul>
    </div>
  )
}

export default UserPage