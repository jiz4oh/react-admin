import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { useLocation } from "react-router-dom";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Breadcrumb } from "./components/Breacrumb";
import { breadcrumbItemBuilder } from "./components/breadcumbItemBuilder";
import {
  getUserInfo,
  clearUserInfo,
  hasIndexPermission,
  hasVisitPermission,
} from "./components/session";
import menus from "./config/menus";
import { MenuItemBuilder, authoriseMenu } from "./components/MenuItemBuilder";

const defaultVisitablePaths = ['dashboard']

const currentUserMenus = () =>
  menus.map(
    i => authoriseMenu(i, path => hasIndexPermission('all') || defaultVisitablePaths.includes(path) || hasVisitPermission(path)),
  ).flat(1).filter(Boolean)

const {Content, Footer} = Layout

function PageContainer({children}) {
  const userName = getUserInfo('userName')
  const avatar = getUserInfo('avatar')
  const location = useLocation()
  const currentPaths = location.pathname.split('/')
  const sidebarMenus = useMemo(() => MenuItemBuilder(currentUserMenus()), [])
  const breadcrumbs = useMemo(() => breadcrumbItemBuilder(currentPaths, currentUserMenus()), [currentPaths])

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
