import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Breadcrumb as AntdBreadcrumb} from 'antd';
import {HomeOutlined} from "@ant-design/icons";

import {menus} from "../../config/menus";
import './index.scss'
import BreadcrumbBuilder from "../../common/js/builder/BreadcumbBuilder";

function Breadcrumb({currentPaths}) {
  let location = useLocation()
  currentPaths = currentPaths || location.pathname.split('/')

  return (
    <AntdBreadcrumb className={'M-breadcrumb'}>
      <AntdBreadcrumb.Item>
        <Link to={'/dashboard'}><HomeOutlined/> 首页</Link>
      </AntdBreadcrumb.Item>
      {BreadcrumbBuilder({currentPaths, menus})}
    </AntdBreadcrumb>
  )
}

export default React.memo(Breadcrumb)
