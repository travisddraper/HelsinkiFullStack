import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  !newToken
    ? token = null
    : token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (blogObject) => {
  const config= {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blogObject, config)

  return response.data
}

const addLike = async (blogObject) => {
  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject)

  return response.data
}

const removeBlog = async (id, token) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}



export default {
  getAll, create, addLike, removeBlog, setToken
}