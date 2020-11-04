import React, { useMemo } from 'react';
import { Layout } from 'antd';
import _ from "lodash";
import { useLocation } from "react-router-dom";

import { Header } from "./components/Header";
import { Sidebar, MenuBuilder } from "./components/Sidebar";
import { Breadcrumb, BreadcrumbBuilder } from "./components/Breacrumb";
import {
  getUserInfo,
  clearUserInfo,
  hasIndexPermission,
  hasVisitPermission,
} from "./components/session";
import menus from "./config/menus";

const currentUserMenus = () => {
  if (hasIndexPermission('all')) {
    return menus
  }

  let result = []
  menus.forEach(item => {
    // component 存在则不查找 subs
    if (!!item.component) {
      // 默认可以访问 dashboard
      if (item.path === 'dashboard' || hasVisitPermission(item.path)) {
        result.push(item)
      }
    } else if (!_.isEmpty(item.subs)) {
      // 复制一级菜单 ，并清空 subs
      let parentItem = JSON.parse(JSON.stringify(item))
      // JSON.parse 无法深拷贝 symbol 类型，所以复制过来
      parentItem.icon = item.icon
      // 清空 subs
      parentItem.subs = []
      // 判断二级菜单权限
      item.subs.forEach(subItem => {
        if (hasVisitPermission(subItem.path)) {
          parentItem.subs.push(subItem)
        }
      })

      // 如果二级菜单为空，则不渲染一级菜单
      if (!_.isEmpty(parentItem.subs)) {
        result.push(parentItem)
      }
    }
  })

  return result
}

const {Content, Footer} = Layout

function PageContainer({children}) {
  const userName = getUserInfo('userName')
  const avatar = getUserInfo('avatar')
  const location = useLocation()
  const currentPaths = location.pathname.split('/')
  const sidebarMenus = useMemo(() => MenuBuilder(currentUserMenus()), [])
  const breadcrumbs = useMemo(() => BreadcrumbBuilder(currentPaths, currentUserMenus()), [currentPaths])

  return (
    <Layout className="G-app-layout">
      <Sidebar currentPaths={location.pathname}>
        {sidebarMenus}
      </Sidebar>
      <Layout style={{flexDirection: 'column'}}>
        <Header userName={userName} avatar={avatar} logout={clearUserInfo}>
          <Breadcrumb>
            {breadcrumbs}
          </Breadcrumb>
        </Header>
        <Content className='clearfix G-app-content'>
          <div className='G-site-main-layout clearfix'>
            {children}
          </div>
        </Content>
        <Footer className="G-app-footer">
          React-Admin ©2020 Created by jiz4oh@gmail.com
        </Footer>
      </Layout>
    </Layout>
  );
}

export default PageContainer
