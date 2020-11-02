import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { HomeOutlined } from "@ant-design/icons";

import './index.scss'

function Breadcrumb({children}) {
  return (
    <AntdBreadcrumb className={'M-breadcrumb'}>
      <AntdBreadcrumb.Item>
        <Link to={'/dashboard'}><HomeOutlined/> 首页</Link>
      </AntdBreadcrumb.Item>
      {children}
    </AntdBreadcrumb>
  )
}

export default React.memo(Breadcrumb)
