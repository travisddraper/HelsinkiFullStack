let timeoutID;

export const notificationBuilder = (msg) => {
  return {
    type: 'NOTIFICATION',
    data: { msg }
  }
}

export const notificationClearer = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}


export const setNotification = (content, time) => {
  if(timeoutID) clearTimeout(timeoutID)

  return async dispatch => {
    dispatch(notificationBuilder(content))
    timeoutID = setTimeout(() => {
      dispatch(notificationClearer())
    }, time + '000')
  }
}

const notificationReducer = (state = '', action) => {

  switch(action.type) {
    case 'NOTIFICATION':
      return action.data.msg
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export default notificationReducer