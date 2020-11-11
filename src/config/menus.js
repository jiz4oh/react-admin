import React from "react";
import {
  HomeOutlined,
  SettingFilled,
  UserOutlined,
} from '@ant-design/icons';

import { permissionRequired } from "../components/session";
import dynamic from "../pages";
import PageContainer from "../layouts/PageContainer";

const menus = [
  {
    path: '/',
    component: PageContainer,
    subs: [
      {
        path: 'dashboard/',
        label: '首页',
        icon: <HomeOutlined/>,
        component: dynamic('dashboard'),
        rules: [permissionRequired.isLoggedIn]
      },
      {
        path: 'user/',
        label: '用户管理',
        icon: <UserOutlined/>,
        subs: [
          {
            name: 'user',
            label: '用户',
            path: 'users',
            rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
            component: dynamic('user')
          },
        ]
      },
      {
        path: 'setting/',
        label: '系统设置',
        icon: <SettingFilled/>,
        subs: [
          {
            name: 'admin_user',
            label: '管理员',
            path: 'admin_users',
            rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
            component: dynamic('adminUser')
          },
          {
            name: 'role',
            label: '角色',
            path: 'roles',
            rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
            component: dynamic('role')
          },
        ],
      },
    ]
  }
]

export default menus
