import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import _ from 'lodash'

import globalConfig from "../../config";
const appRootPath = globalConfig.appRootPath || ''

const renderMenuItem = (item, parentPaths, restProps) => {
  const {path, label} = item
  const currentMenuPaths = [...parentPaths, path]
  let currentPath = currentMenuPaths.join('')

  currentPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath
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
  const currentMenuPaths = [...parentPaths, path]
  const currentPath = currentMenuPaths.join('')

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

/**
 *
 * @param menuItem {Object} 需要判断的菜单对象
 * @param authoriseFn {Function} 判断函数
 * @returns {FlatArray<[], number>[]|{path}|*}
 */
function authoriseMenu(menuItem, authoriseFn) {
  const path = !!menuItem.path ? menuItem.path.split('/').join('') : ''

  if (_.isEmpty(menuItem.subs)) {
    if (authoriseFn(path)) return menuItem
  } else {
    let subs = []
    for (let i = 0; i < menuItem.subs.length; i++) {
      subs.push(authoriseMenu(menuItem.subs[i], authoriseFn))
    }

    subs = subs.flat(1).filter(Boolean)
    // 当 menuItem.path 为 / 时，不生成菜单
    if (path === '') return subs

    // 过滤为空的结果
    if (!_.isEmpty(subs)) {
      // 复制上级菜单
      let parentItem = _.cloneDeep(menuItem)
      // symbol 类型无法深拷贝，所以引用过来
      parentItem.icon = menuItem.icon
      parentItem.subs = subs
      return parentItem
    }
  }
}

export default MenuBuilder
export { authoriseMenu }
