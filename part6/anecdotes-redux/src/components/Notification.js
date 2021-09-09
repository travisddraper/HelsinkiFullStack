import React from 'react'
//With Hooks-api
//import { useSelector } from 'react-redux'
import { connect } from 'react-redux'

const Notification = (props) => {
  //With Hooks-api
  //const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <>
    {props.notification
      ? <div style={style}>
          {props.notification}
        </div>
      : null
    }
    </>
  )
}

const mapStateToProps = state => ( { notification: state.notification } )

export default connect(
  mapStateToProps,
  null
)(Notification)

//With Hooks-api
//export default Notification