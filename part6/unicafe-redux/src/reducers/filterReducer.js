
export const filterObject = (content) => {
  return {
    type: "FILTER",
    data: { content }
  }
}

const filterReducer = (state = '', action) => {

  switch(action.type) {
    case "FILTER":
      return action.data.content
    default:
      return state
  }
}

export default filterReducer