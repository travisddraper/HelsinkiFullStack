import axios from 'axios'
const baseUrl = '/api/users'

const getUsers = async(sourceToken = null) => {
  const config = {
    cancelToken: sourceToken
  }
  const request = await axios.get(baseUrl, config)
  return request.data
}

const getUserBlogs = async(id) => {
  const request = await axios.get(`${baseUrl}/${id}`)
  return request.data
}

export default {
  getUsers, getUserBlogs
}