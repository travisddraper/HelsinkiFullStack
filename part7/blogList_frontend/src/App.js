/* eslint-disable linebreak-style */
import React, { useEffect } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import blogService from './services/blogs'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { setBlogs, likeBlog, removeBlog } from './reducers/blogReducer'
import { notificationBuilder, notificationClearer } from './reducers/notificationReducer'
import { userLogin, userLogout } from './reducers/userReducer'
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom'

import UserPage from './components/User'
import Users from './components/Users'
import { BlogsPage } from './components/Users'
import BlogView from './components/BlogView'
import { Navbar } from 'react-bootstrap'

function NavBar({ user, logout }) {
  const style={ color: 'white' }
  return (
    <Navbar style={style} bg='dark' >
      <Link style={{ padding: '15px', color: 'white' }} to='/blogs'>Blogs</Link>
      <Link style={{ padding: '15px', color: 'white' }} to='/users'>Users</Link>
      {user &&
          <>
            {user.username}
            <button style={{ marginLeft: '10px' }}onClick={logout}>Logout</button>
          </>}
    </Navbar>
  )
}


function App() {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const message = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const history = useHistory()


  useEffect(() => {
    async function loadBlogs() {
      try {
        const initialBlogs = await blogService.getAll()
        dispatch(setBlogs(initialBlogs))
      } catch (e){
        dispatch(notificationBuilder('Unable to connect to server', false))
        setTimeout(() => {
          dispatch(notificationClearer())
        }, 5000)
      }
    }
    loadBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(userLogin(user))
      blogService.setToken(user.token)
      history.push('/users')
    }
  }, [])



  const login = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(userLogin(user))
      history.push('/users')

    } catch (e) {
      dispatch(notificationBuilder('Wrong credentials', false))
      setTimeout(() => {
        dispatch(notificationClearer())
      }, 5000)
    }

  }

  const logout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem(
        'loggedBlogAppUser'
      )
      blogService.setToken(null)
      dispatch(userLogout())
    } catch (e) {
      dispatch(notificationBuilder('Unable to logout User', false))
      setTimeout(() => {
        dispatch(notificationClearer())
      }, 5000)
    }
  }


  const updateLikes = async (blog) => {
    blog.likes += 1
    try {
      const newBlog = await blogService
        .addLike(blog)
      dispatch(likeBlog(newBlog))

    } catch (exception) {
      console.log(exception)
    }
  }

  const deleteBlog = async(blog) => {
    try {
      if(window.confirm(`Delete Blog "${blog.title}" by ${blog.author.name}?`)) {
        const token = `bearer ${JSON.parse(window.localStorage.getItem('loggedBlogAppUser')).token}`
        await blogService
          .removeBlog(blog.id, token)
        dispatch(removeBlog(blog.id))
      }
    } catch (exception) {
      console.log(exception)
    }

  }


  return (
    <div>
      <NavBar user={user} logout={logout}  />
      <Notification message={message.msg} messageStatus={message.status} />
      <div className="container">
        <Switch>
          <Route exact path="/" render={() => {
            return user ? <Redirect to="/users" /> : <Redirect to="/login" />
          }}/>
          <Route path="/users/:id" component={UserPage} />
          <Route path="/blogs/:id" render={() => <BlogView addLike={updateLikes} deleteBlog={deleteBlog} />} />
          <Route path="/login" render={() => <LoginForm handleLogin={login} />} />
          <Route path="/users" render={() => {
            return user ? <Users /> : <Redirect to="/login"/>
          }}/>
          <Route path="/blogs" render={() => <BlogsPage blogs={blogs} />} />
        </Switch>
        <Footer/>
      </div>
    </div>
  )
}

export default App
