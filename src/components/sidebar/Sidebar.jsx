import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd';

import menus from "../../config/menus";
import Logger from "../../common/js/Logger";
import MenuBuilder from "../../common/js/builder/MenuBuilder";

const logger = Logger.getLogger('sidebar')

const Sidebar = ({
  mode: PreMode = 'inline',
  currentPath
}) => {
  // eslint-disable-next-line
  const [mode, changeMenu] = useState(PreMode)
  const [openKeys, setOpenKeys] = useState([])
  // eslint-disable-next-line
  const [selectedKey, selectKey] = useState(currentPath)

  const location = useLocation()

  const handleClickOpenMenu = useCallback(
    key => {
      logger.debug('打开菜单:' + key)
      setOpenKeys(key)
    }, []
  )

  const sidebarMenus = useMemo(() =>
    MenuBuilder({ menus: menus() })
    , []
  )

  return (
    <Layout.Sider collapsible>
      <div
        className="logo"
        style={{
          height: '32px',
          background: 'rgba(255, 255, 255, .2)',
          margin: '16px'
        }}
      />
      <Menu
        theme="dark"
        mode={mode}
        selectedKeys={[selectedKey || location.pathname]}
        openKeys={openKeys}
        onOpenChange={handleClickOpenMenu}
      >
        {sidebarMenus}
      </Menu>
    </Layout.Sider>
  )
}

export default React.memo(Sidebar)
