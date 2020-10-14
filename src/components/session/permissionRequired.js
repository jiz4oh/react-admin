import React from "react";
import { message } from "antd";
import { Redirect } from "react-router-dom";

import { clearUserInfo } from "./session";
import { hasVisitPermission, isLoggedIn } from "./permissions";

function Logout({location}) {
  // 未登录跳转登录
  clearUserInfo() && message.error('用户信息获取失败。。。')
  return (
    <Redirect to={{
      pathname: '/login',
      state: {from: location}
    }}/>
  )
}

export default {
  isLoggedIn: {
    require: isLoggedIn,
    onFail: Logout
  },
  hasVisitPermission: {
    require: ({location}) => !!hasVisitPermission(location.pathname)
  },
}
