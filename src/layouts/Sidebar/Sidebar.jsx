import React, { useCallback, useState } from "react";
import { Layout, Menu } from 'antd';
import _ from "lodash"
import PropTypes from "prop-types";

import Logger from "../../utils/Logger";

const logger = Logger.getLogger('sidebar')

const Sidebar = ({
                   mode: PreMode = 'inline',
                   currentPaths,
                   children,
                 }) => {
  // eslint-disable-next-line
  const [mode, changeMenu] = useState(PreMode)
  const [openKeys, setOpenKeys] = useState([])

  const handleClickOpenMenu = useCallback(
    key => {
      logger.debug('打开菜单:' + key)
      setOpenKeys(key)
    }, []
  )

  currentPaths = _.isArray(currentPaths) ? currentPaths : [currentPaths]
  currentPaths = currentPaths.flat().filter(Boolean)
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
        selectedKeys={currentPaths}
        openKeys={openKeys}
        onOpenChange={handleClickOpenMenu}
      >
        {children}
      </Menu>
    </Layout.Sider>
  )
}

Sidebar.propTypes = {
  mode: PropTypes.string,
  currentPaths: PropTypes.oneOfType([
                                      PropTypes.array,
                                      PropTypes.string
                                    ]),
}

export default React.memo(Sidebar)
