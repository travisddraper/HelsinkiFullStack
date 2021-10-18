/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import userService from '../services/users'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { notificationBuilder, notificationClearer } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { getAllUsers } from '../reducers/usersReducer'
import { Redirect, Link } from 'react-router-dom'

import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blogs from './Blog'


import { Table } from 'react-bootstrap'
const UserRow = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={{
          pathname: `/users/${user.id}`
        }}>{user.username}</Link>
      </td>
      <td>
        {user.blogs.length}
      </td>
    </tr>
  )
}
const UsersTable = ({ users }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => <UserRow key={user.id} user={user}/>)}
      </tbody>
    </Table>
  )
}

const UsersPage = () => {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    const asyncFunction = async() => {
      const users = await userService.getUsers()
      dispatch(getAllUsers(users))
    }
    try {
      asyncFunction()
    } catch (e) {
      console.log(e.message)
    }
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <UsersTable users={users} />
      <br/><br/>

    </div>
  )
}

export const BlogsPage = ({ blogs }) => {
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  if(!user) return <Redirect to="/login" />

  const submitBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(createBlog(newBlog))
      dispatch(notificationBuilder(`New Blog:  ${blogObject.title} by ${user.name} added`, true))
      setTimeout(() => {
        dispatch(notificationClearer())
      }, 5000)

    } catch (e) {
      dispatch(notificationBuilder('Could not upload blog to server', false))
      setTimeout(() => [
        dispatch(notificationClearer())
      ], 5000)
    }
  }

  return (
    <div>
      <Togglable className='toggleButtonBox' buttonLabel='Create New Blog' ref={blogFormRef}>
        <BlogForm author={user.name} handleSubmit={submitBlog} />
      </Togglable>
      <Blogs blogs={blogs} />
    </div>
  )
}

export default UsersPage