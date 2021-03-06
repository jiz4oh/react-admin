import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import queryString from 'query-string';
import _ from 'lodash'
import { Result, Button } from "antd";

import Protected from "../../lib/components/Protected";

const appRootPath = process.env.REACT_APP_ROOT_PATH || ''

const _404 = (
  <Route
    render={props =>
      <Result
        status="404"
        title="404"
        subTitle="对不起，页面不存在"
        extra={
          <>
            <Button type="primary"
                    onClick={() => props.history.push('/dashboard')}>
              返回控制面板
            </Button>
            <Button onClick={() => props.history.goBack()}>
              返回上一页
            </Button>
          </>
        }
      />
    }/>)

// 生成路由
const generateRoute = (rule, parentPaths) => {
  const {
    component: Component,
    path,
    label,
    layout: Layout,
    rules
  } = rule
  // Component 存在才挂载路由
  if (!Component) return

  let currentRoutePaths = [...parentPaths]
  currentRoutePaths.push(path)

  const currentPath = currentRoutePaths.join('')

  return (
    <Route
      path={currentPath}
      key={currentPath}
      render={props => {
        const reg = /\?\S*/g;
        // 匹配?及其以后字符串
        const queryParams = window.location.hash.match(reg);
        // 去除?的参数
        const { params } = props.match;
        _.forEach(params, (value, key) => {
          params[key] = value && value.replace(reg, '');
        });
        props.match.params = { ...params };
        const merge = {
          ...props,
          q:
            queryParams
              ? queryString.parse(queryParams[0])
              : {},
        };

        const rawComponent = <Component {...merge} />
        const decoratedComponent = Layout ?
          <Layout children={rawComponent}/> : rawComponent
        const isProtected = rules
          ? <Protected
            rules={rules}
            children={decoratedComponent}
            onFail={() => (
              <Result
                status="403"
                title={"403"}
                subTitle={"对不起，您没有权限访问该页面"}
                extra={
                  <>
                    <Button
                      type="primary"
                      onClick={() => props.history.push('/dashboard')}
                    >
                      返回控制面板
                    </Button>
                    <Button onClick={() => props.history.goBack()}>
                      返回上一页
                    </Button>
                  </>
                }
              />
            )}
          />
          : decoratedComponent
        return (
          <DocumentTitle title={label}>
            {isProtected}
          </DocumentTitle>
        );
      }}
    />
  )
}

const generateNestRoutes = (item, parentPaths) => {
  const { path, component: Component, subs } = item
  let currentRoutePaths = [...parentPaths]
  currentRoutePaths.push(path)

  const currentPath = currentRoutePaths.join('')
  const result = <Switch
    children={[...recurseRoutes(subs, currentRoutePaths), _404]}/>
  return (
    <Route path={currentPath} key={currentPath}>
      {Component
        ? <Component children={result}/>
        : result
      }
    </Route>
  )
}

const recurseRoutes = (subs, currentPaths) =>
  subs && subs.map(item => !_.isEmpty(item.subs) ? generateNestRoutes(item, currentPaths) : generateRoute(item, currentPaths))

/**
 *
 * @param routes {Object} Json 路由配置表
 * @return {ReactNode} 返回一份路由表
 */
const RouteBuilder = ({ routes }) =>
  <Switch children={[...recurseRoutes(routes, [appRootPath]), _404]}/>

export default RouteBuilder
