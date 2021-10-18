export const userLogin = (user) => {
  return {
    type: 'LOGIN',
    data: user
  }
}

export const userLogout = () => {
  return {
    type: 'LOGOUT'
  }
}


const userReducer = (state=null, action) => {
  switch(action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export default userReducer