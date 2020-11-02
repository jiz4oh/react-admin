import React, { useCallback } from "react";
import { Layout, Menu } from 'antd';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import './index.scss'
import default_avatar from './default_avatar.jpeg'

const {SubMenu, Item: MenuItem, ItemGroup: MenuItemGroup} = Menu

function Header({
                  userName = '管理员',
                  avatar = default_avatar,
                  children,
                  logout,
                }) {
  const handleLogout = useCallback(() => logout(), [logout])
  return (
    <Layout.Header className='M-header clearfix'>
      <div className={'M-header-left'}>
        {children}
      </div>
      <div className={'M-header-right'}>
        <Menu mode="horizontal" className={'M-header-userMenu'}>
          <SubMenu
            title={
              <span className="M-header-avatar">
                <img src={avatar} alt="头像"/>
                <i/>
              </span>
            }
          >
            <MenuItemGroup title={`你好 - ${userName}`}>
              <MenuItem key="personalInfo">个人信息</MenuItem>
              <MenuItem key="logout">
                <span onClick={handleLogout}>
                  <Link to={'/login'}>退出登录</Link>
                </span>
              </MenuItem>
            </MenuItemGroup>
          </SubMenu>
        </Menu>
      </div>
    </Layout.Header>
  )
}

Header.propTypes = {
  userName: PropTypes.string,
  avatar: PropTypes.string,
  logout: PropTypes.func.isRequired
};

export default React.memo(Header)
