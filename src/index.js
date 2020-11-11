import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import { Alert } from 'antd';
import loadable from "@loadable/component";

import './styles/frame.scss'
import store from './store'
import PageLoading from "./components/PageLoading";
import RouteBuilder from "./components/RouteBuilder";
import menus from "./config/menus";

const { ErrorBoundary } = Alert;

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <Suspense fallback={<PageLoading/>}>
        <Router>
          <Switch>
            <Route exec path="/login" component={loadable(() => import('./pages/login'))}/>
            <Route exec path="/404" component={loadable(() => import('./components/NotFound'))}/>
            <RouteBuilder routes={menus}/>
          </Switch>
        </Router>
      </Suspense>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
)
