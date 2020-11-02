import React from "react";
import {
  HomeOutlined,
  SettingFilled,
  UserOutlined,
} from '@ant-design/icons';

import { permissionRequired } from "../components/session";
import Dashboard from "../pages/dashboard";
import User from '../pages/user'
import AdminUser from '../pages/adminUser'
import Role from '../pages/role'

const menus = [
  // 菜单相关路由
  {
    path: 'dashboard',
    label: '首页',
    icon: <HomeOutlined/>,
    component: Dashboard,
    rules: [permissionRequired.isLoggedIn]
  },
  {
    path: 'user',
    label: '用户管理',
    icon: <UserOutlined/>,
    subs: [
      {
        name: 'user',
        label: '用户',
        path: 'users',
        rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
        component: User
      },
    ]
  },
  {
    path: 'setting',
    label: '系统设置',
    icon: <SettingFilled/>,
    subs: [
      {
        name: 'admin_user',
        label: '管理员',
        path: 'admin_users',
        rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
        component: AdminUser
      },
      {
        name: 'role',
        label: '角色',
        path: 'roles',
        rules: [permissionRequired.isLoggedIn, permissionRequired.hasVisitPermission],
        component: Role
      },
    ],
  }
]

export default menus
