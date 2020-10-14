import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './common/js/App'
import './common/style/frame.scss'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)