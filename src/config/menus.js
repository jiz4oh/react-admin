import React from "react";
import {
  HomeOutlined,
  SettingFilled,
  UserOutlined,
} from '@ant-design/icons';
import _ from 'lodash'

import {
  hasIndexPermission,
  hasVisitPermission,
  permissionRequired,
} from "../components/session";
import Dashboard from "../pages/dashboard";
import User from '../pages/user'
import AdminUser from '../pages/adminUser'
import Role from '../pages/role'

let menus = [
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

const menusUnderPermissions = () => {
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

export default menusUnderPermissions
export { menus }
