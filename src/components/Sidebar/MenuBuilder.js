import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import _ from 'lodash'

import globalConfig from "../../config";
const appRootPath = globalConfig.appRootPath || ''

const renderMenuItem = (item, parentPaths, restProps) => {
  const {path, label} = item
  let currentMenuPaths = [...parentPaths]
  currentMenuPaths.push(path)
  const currentPath = currentMenuPaths.join('/')

  return (
    <Menu.Item key={currentPath} {...restProps}>
      <Link to={currentPath}>
        {item.icon}
        <span className="nav-text">{label}</span>
      </Link>
    </Menu.Item>
  );
}

const renderSubMenu = (item, parentPaths, restProps) => {
  const {path, icon, label, subs} = item
  let currentMenuPaths = [...parentPaths]
  currentMenuPaths.push(path)
  const currentPath = currentMenuPaths.join('/')

  return (
    <Menu.SubMenu
      key={currentPath}
      title={
        <span className="nav-text">
            {label}
          </span>
      }
      icon={icon}
      {...restProps}
    >
      {subMenusMap(subs, currentMenuPaths, restProps)}
    </Menu.SubMenu>
  )
}

const subMenusMap = (subs, currentPaths, restProps) => subs && subs.map(
  item => !_.isEmpty(item.subs) ? renderSubMenu(item, currentPaths, restProps) : renderMenuItem(item, currentPaths, restProps)
)

/**
 * 因为 antd 的原因，不要将 MenuBuilder 作为组件使用，否则导致高亮不正确等问题
 * @param menus {Object[]} 预设菜单表
 * @param restProps {any[]} 其他传递给 Menu 组件的 props
 * @return {React.ReactElement[]} 返回一份菜单表
 */
const MenuBuilder = (menus, ...restProps) => subMenusMap(menus, [appRootPath], restProps)

export default MenuBuilder
