import React from "react";
import {Breadcrumb as AntdBreadcrumb} from "antd";
import {Link} from "react-router-dom";
import _ from 'lodash'

import {appRootPath} from "./RouteBuilder";

const notBreadcrumbs = [appRootPath, 'dashboard']

/**
 * 生成 breadcrumb
 * @param menu {Object} 当前菜单对象
 * @param parentPaths {String[]} 父级菜单路径
 * @param canClick {Boolean} 当前 breadcrumb 是否可点击
 * @return {ReactNode}
 */
const renderBreadcrumb = (menu, parentPaths, canClick = true) => {
  // menu 如果为 {} [] null 等一律返回 undefined
  if (_.isEmpty(menu)) return undefined
  const {icon, label, path} = menu

  const currentMenuPaths = [...parentPaths]
  currentMenuPaths.push(path)
  const currentPath = currentMenuPaths.join('/')

  return (
    <AntdBreadcrumb.Item key={currentPath}>
      {canClick
        ? <Link to={currentPath}>
          {icon} {label}
        </Link>
        : <>
          {icon} {label}
        </>
      }
    </AntdBreadcrumb.Item>
  )
}

/**
 * 根据 currentPaths 递归生成 breadcrumb
 * @param subMenus {Object[]} 需要查找的菜单
 * @param paths {Array} 上层路径
 * @param currentPaths {Array} 当前需要转换的路径
 * @return {ReactNode[]}
 */
const recurseBreadcrumbs = (subMenus, paths, currentPaths) => {
  // 获取当前路径
  const currentPath = currentPaths[0]

  // 其他需要转换为 breadcrumb 的路径
  const nextPaths = currentPaths.slice(1)
  // 当前路径满足不转换条件时跳过转换
  // item 可能为 ''，所以必须判断 undefined
  if (notBreadcrumbs.find(item => item === currentPath) !== undefined) {
    return recurseBreadcrumbs(subMenus, paths, nextPaths)
  }

  // 查找符合条件的 menu
  const menu = subMenus.find(menu => menu.path === currentPath) || {}
  const {subs, path} = menu

  return !_.isEmpty(subs)
    ? [renderBreadcrumb(menu, paths, false), recurseBreadcrumbs(subs, [...paths, path], nextPaths)]
    : renderBreadcrumb(menu, paths)
}

export default function BreadcrumbBuilder({currentPaths, menus}) {
  return [recurseBreadcrumbs(menus, [appRootPath], currentPaths)].flat().filter(Boolean)
}