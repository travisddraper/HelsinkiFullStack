export const notificationBuilder = (msg, status) => {
  return {
    type: 'NOTIFICATION',
    data: { msg, status }
  }
}

export const notificationClearer = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}


const notificationReducer = (state = { msg: null, status: false }, action) => {

  switch(action.type) {
  case 'NOTIFICATION':
    return action.data
  case 'CLEAR_NOTIFICATION':
    return { msg: null, status: false }
  default:
    return state
  }
}

export default notificationReducer