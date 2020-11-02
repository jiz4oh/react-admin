import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Alert } from 'antd';

import App from './App'
import store from './store'

const { ErrorBoundary } = Alert;

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <App/>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
)
