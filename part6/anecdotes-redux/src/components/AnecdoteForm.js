import React from 'react'
//With Hooks-api
//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { newEntry } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  //With Hooks-api
  //const dispatch = useDispatch()

  const addAnecdote = async(event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.newEntry(content)
    props.setNotification(`New anecdote "${content}" added!`, 5)

    //With Hooks-api
    //dispatch(newEntry(content))
    //dispatch(setNotification(`New anecdote "${content}" added!`, 5))
  }

  return (
    <>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
    </>
  )
}
export default connect(
  null,
  { setNotification,
    newEntry
  }
)(AnecdoteForm)
//With Hooks-api
//export default AnecdoteForm