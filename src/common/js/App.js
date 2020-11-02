import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import Login from '../../pages/login'
import {NotFound} from '../../components/NotFound'
import Logger from "./Logger";
import RouteBuilder from "./builder/RouteBuilder";
import menus from '../../config/menus'
import {defaultLayout as DefaultLayout} from "../../layouts";

const logger = Logger.getLogger('app')

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logger.error(error)
    logger.error(errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const routesByMenu = () =>
  <DefaultLayout>
    {RouteBuilder({routes: menus})}
  </DefaultLayout>

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route exec path="/login" component={Login}/>
          <Route exec path="/404" component={NotFound}/>
          {routesByMenu()}
        </Switch>
      </Router>
    </ErrorBoundary>
  )
}

export default App
