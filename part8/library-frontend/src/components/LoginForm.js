import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      localStorage.setItem('library-user-token', token)
      setToken(token)
      console.log('token set in storage', token)
    }
  }, [result.data])

  const submit = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })
  }


  return (
    <div>
      <form onSubmit={submit}>
        username <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        /> <br/>
        password <input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm