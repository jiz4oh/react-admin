import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { useLocation } from "react-router-dom";

import "./index.scss"
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { Breadcrumb } from "../Breacrumb";
import { breadcrumbItemBuilder } from "../../components/breadcumbItemBuilder";
import {
  getUserInfo,
  clearUserInfo,
  hasIndexPermission,
  hasVisitPermission,
} from "../../session";
import menus from "../../config/menus";
import { menuItemBuilder, authoriseMenu } from "../../components/menuItemBuilder";

const defaultVisitablePaths = ['dashboard']

const currentUserMenus = () =>
  menus.map(
    i => authoriseMenu(i, path => hasIndexPermission('all') || defaultVisitablePaths.includes(path) || hasVisitPermission(path)),
  ).flat(1).filter(Boolean)

const { Content, Footer } = Layout

function PageContainer({ children }) {
  const userName = getUserInfo('userName')
  const avatar = getUserInfo('avatar')
  const location = useLocation()
  const currentPaths = location.pathname.split('/')
  const sidebarMenus = useMemo(() => menuItemBuilder(currentUserMenus()), [])
  const breadcrumbs = useMemo(() => breadcrumbItemBuilder(currentPaths, currentUserMenus()), [currentPaths])

  return (
    <Layout className="app-layout">
      <Sidebar currentPaths={location.pathname}>
        {sidebarMenus}
      </Sidebar>
      <Layout className="app-layout-main">
        <Header
          className="app-layout-header"
          userName={userName}
          avatar={avatar}
          logout={clearUserInfo}
        >
          <Breadcrumb>
            {breadcrumbs}
          </Breadcrumb>
        </Header>
        <Content className='clearfix app-layout-content'>
          {children}
        </Content>
        <Footer className="app-layout-footer">
          React-Admin ©2020 Created by jiz4oh@gmail.com
        </Footer>
      </Layout>
    </Layout>
  );
}

export default React.memo(PageContainer)
