import React from 'react'

const Notification = ({ message, messageStatus }) => {
  if(message === null) {
    return null
  }

  return (
    <>
      {!messageStatus
        ?
        <div className="error">
          {message}
        </div>
        : <div className="success">
          {message}
        </div>
      }
    </>
  )
}

export default Notification