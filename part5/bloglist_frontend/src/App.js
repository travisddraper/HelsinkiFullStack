/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Blogs from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    async function loadBlogs() {
      try {
        const initialBlogs = await blogService
          .getAll()
        setBlogs(initialBlogs)
      } catch (e){
        setMessage('Unable to connect to server')
        setTimeout(() => [
          setMessage(null)
        ], 5000)
      }
    }
    loadBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



  const login = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

    } catch (e) {
      setMessage('Wrong credentials')
      setTimeout(() => [
        setMessage(null)
      ], 5000)
    }

  }

  const logout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem(
        'loggedBlogAppUser'
      )
      blogService.setToken(null)
      setUser(null)
    } catch (e) {
      setMessage('Unable to logout User')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const submitBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService
        .create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessageStatus(true)
      setMessage(`New Blog:  ${blogObject.title} by ${user.name} added`)
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 5000)

    } catch (e) {
      setMessage('Could not upload blog to server')
      setTimeout(() => [
        setMessage(null)
      ], 5000)
    }
  }

  return (
    <div>
      <Notification message={message} messageStatus={messageStatus} />
      <div className="container">
        {user === null
          ?
          <LoginForm handleLogin={login} />
          :
          <>
            {user.name} logged-in
            <button onClick={logout}>Logout</button>

            <Togglable buttonLabel='Create New Blog' ref={blogFormRef}>
              <BlogForm author={user.name} handleSubmit={submitBlog} />
            </Togglable>

            <Blogs blogs={blogs} setBlogs={setBlogs} />
          </>
        }
        <Footer/>
      </div>


    </div>


  )
}

export default App
