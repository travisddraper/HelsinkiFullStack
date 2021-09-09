import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { anecdoteVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ vote, anecdote }) => {
  const { id, content, votes } = anecdote
  
  return (
    <div key={id}>
      <div>
        {content}
      </div>
      <div>
        has {votes}
        <button onClick={() => vote(id)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch();

  const vote = (id) => {
    const updateAnecdote = anecdotes.find(n => n.id === id)
    updateAnecdote.votes ++

    dispatch(anecdoteVote(updateAnecdote))
    dispatch(setNotification(`You voted for "${updateAnecdote.content}"`, 5))
  }

  return (
    <>
    {anecdotes.sort((a, b) => b.votes-a.votes).map(anecdote => {
      if(anecdote.content.toLowerCase().includes(filter)) {
        return <Anecdote key={anecdote.id} anecdote={anecdote} vote={vote} />
      }
      return null
    }
    )}
    </>
  )
}

export default AnecdoteList