import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './pages/login'
import { NotFound } from './components/NotFound'
import RouteBuilder from "./common/js/builder/RouteBuilder";
import menus from './config/menus'
import { defaultLayout as DefaultLayout } from "./layouts";
import './common/style/frame.scss'

const routesByMenu = () =>
  <DefaultLayout>
    {RouteBuilder({routes: menus})}
  </DefaultLayout>

function App() {
  return (
    <Router>
      <Switch>
        <Route exec path="/login" component={Login}/>
        <Route exec path="/404" component={NotFound}/>
        {routesByMenu()}
      </Switch>
    </Router>
  )
}

export default App
