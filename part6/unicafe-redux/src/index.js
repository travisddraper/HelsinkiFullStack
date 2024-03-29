import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const dispatchNumber = (type) => {
    if(type) {
      store.dispatch({ type })
    }
  }

  return (
    <div>
      <button onClick={() => dispatchNumber('GOOD')}>good</button> 
      <button onClick={() => dispatchNumber('OK')}>neutral</button> 
      <button onClick={() => dispatchNumber('BAD')}>bad</button>
      <button onClick={() => dispatchNumber('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)