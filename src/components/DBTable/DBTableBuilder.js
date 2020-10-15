import React from "react"
import _ from 'lodash'

import DBTable from "./DBTable";
import globalConfig from '../../config'

const defaultTableConfig = globalConfig.DBTable || {}

export default function (config) {
  // 不使用 defaultsDeep，会造成配置覆写不完全
  const customConfig = _.defaults(config, defaultTableConfig)
  return function (props) {
    return <DBTable {...props} {...customConfig}/>
  }
}
