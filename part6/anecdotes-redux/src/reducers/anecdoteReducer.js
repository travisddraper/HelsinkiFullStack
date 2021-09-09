import anecdoteService from '../service/anecdotes'

export const newEntry = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: "NEW_ANECDOTE",
      data: newAnecdote
    })
  }
}

export const anecdoteVote = (id) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.updateOne(id)
    dispatch({
      type: "VOTE",
      data: updatedAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type:"INIT_ANECDOTES",
      data: anecdotes
    })
  }
}

const anecdoteReducer = (state = [], action) => {

  switch(action.type) {
    case 'VOTE':
      const updatedAnecdote = action.data
      return state.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export default anecdoteReducer