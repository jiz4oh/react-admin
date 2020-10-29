import React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";

import { Breadcrumb } from "../breacrumb";
import './index.scss'
import default_avatar from '../../common/style/default_avatar.jpeg'
import { clearUserInfo, getUserInfo } from "../session";

const { SubMenu, Item: MenuItem, ItemGroup: MenuItemGroup } = Menu

function Header() {
  const userName = getUserInfo('userName')
  const avatar = getUserInfo('avatar')

  return (
    <Layout.Header className='M-header clearfix'>
      <div className={'M-header-left'}>
        <Breadcrumb />
      </div>
      <div className={'M-header-right'}>
        <Menu mode="horizontal" className={'M-header-userMenu'}>
          <SubMenu
            title={
              <span className="M-header-avatar">
                <img src={avatar || default_avatar} alt="头像" />
                <i />
              </span>
            }
          >
            <MenuItemGroup title={`你好 - ${userName || '管理员'}`}>
              <MenuItem key="personalInfo">个人信息</MenuItem>
              <MenuItem key="logout">
                <span onClick={clearUserInfo}>
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

export default React.memo(Header)
