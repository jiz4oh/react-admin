import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import loadable from "@loadable/component";

import './common/style/frame.scss'
import RouteBuilder from "./components/RouteBuilder";
import menus from './config/menus'
import PageLoading from "./components/PageLoading"

function App() {
  return (
    <Suspense fallback={<PageLoading/>}>
      <Router>
        <Switch>
          <Route exec path="/login" component={loadable(() => import('./pages/login'))}/>
          <Route exec path="/404" component={loadable(() => import('./components/NotFound'))}/>
          <RouteBuilder routes={menus}/>
        </Switch>
      </Router>
    </Suspense>
  )
}

export default App
