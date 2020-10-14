import React from 'react';
import {Layout} from 'antd';

import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const {Content, Footer} = Layout

function PrimaryLayout(props) {
  const {children} = props

  return (
    <Layout className="G-app-layout">
      <Sidebar/>
      <Layout style={{flexDirection: 'column'}}>
        <Header/>
        <Content className='clearfix G-app-content'>
          <div className='G-site-main-layout clearfix'>
            {children}
          </div>
        </Content>
        <Footer className="G-app-footer">
          React-Admin ©2020 Created by jiz4oh@gmail.com
        </Footer>
      </Layout>
    </Layout>
  );
}

export default PrimaryLayout
