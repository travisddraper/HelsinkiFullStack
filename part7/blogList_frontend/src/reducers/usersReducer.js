
export const getAllUsers = (users) => {
  return {
    type: 'GET_ALL',
    data: users
  }
}

const usersReducer = (state = [], action) => {
  switch(action.type) {
  case 'GET_ALL':
    return action.data
  default: {
    return state
  }
  }
}

export default usersReducer