import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, FormControl } from 'react-bootstrap'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (e) => {
    e.preventDefault()

    const loginObject = {
      username,
      password
    }

    handleLogin(loginObject)
  }


  return (
    <div>
      <h2>Log into application</h2>

      <Form className="loginForm" onSubmit={login}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <FormControl
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <FormControl
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button id="login-button" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm