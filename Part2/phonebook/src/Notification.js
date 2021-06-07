import { getQueriesForElement } from '@testing-library/dom'
import react from 'react'

const Notification = ({message, type}) => {

    const errorStylings = type
        ?   {
                backgroundColor: 'rgba(123, 239, 178, 0.5)',
                fontSize: 32,
                fontWeight: 'bold'
            }
        :
            {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                fontSize: 32,
                fontWeight: 'bold'
            }

    if(message === null) {
        return null
    }

    return (
        <div className="error" style={errorStylings} >
            {message}
        </div>
    )
}

export default Notification