/* eslint-disable linebreak-style */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
//import reportWebVitals from './reportWebVitals'
import store from './store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

//reportWebVitals()
