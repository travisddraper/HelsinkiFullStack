import axios from 'axios'

const baseURL = 'http://localhost:3001/anecdotes'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const getAll = async() => {
  const response = await axios.get(baseURL)
  return response.data
}

const createNew = async(content) => {
  const object = {
    content,
    votes: 0,
    id: generateId()
  }
  const response = await axios.post(baseURL, object)
  return response.data
}

const updateOne = async(updatedAnecdote) => {
  const response = await axios.put(`${baseURL}/${updatedAnecdote.id}`, updatedAnecdote)
  return response.data
}

const anecdoteService = {
  getAll,
  createNew,
  updateOne
}

export default anecdoteService