import React from 'react'
import { filterObject } from '../reducers/filterReducer'
//With Hooks-api
//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'

const FilterBox = (props) => {
  //With Hooks-api
/*const dispatch = useDispatch()
  const handleFilter = ({ target }) => {
    const filterValue = target.value.toLowerCase()
    dispatch(filterObject(filterValue))
  }*/
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter
      <input
        type="text"
        name="filter"
        onChange={(e) => 
          props.filterObject(e.target.value.toLowerCase())}
      />
    </div>
  )
}

export default connect(
  null,
  { filterObject }
)(FilterBox)

//With Hooks-api
//export default FilterBox