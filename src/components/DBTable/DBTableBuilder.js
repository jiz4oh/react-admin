import React from "react"
// import _ from 'lodash'
//
import DBTable from "./DBTable";
// import globalConfig from '../../config'
// import Logger from "../../common/js/Logger";
//
// const logger = Logger.getLogger('DBTableBuilder')
//
// const DBTableCache = new Map()
//
// function getTableConfig(tableName) {
//   const defaultTableConfig = globalConfig.DBTable || {}
//   let result = defaultTableConfig
//   try {
//     const tableConfigFile = require(`../../config/models/${tableName}.js`)
//     // 同时兼容 ESModule 与 CommonJs 导出方式
//     const customTableConfig = tableConfigFile.default || tableConfigFile
//     result = _.defaults(customTableConfig, defaultTableConfig)
//   } catch (e) {
//     logger.warn('can not find config for table %s, use default instead', tableName);
//   }
//   return _.cloneDeep(result)
// }
//
// const DBTableBuilder = ({name, label, path = null, ...other}) => {
//   let result = DBTableCache.get(name)
//
//   if (!_.isObject(result)) {
//     result = {
//       path: path || name,
//       label: label,
//       component: function (props) {
//         return <DBTable tableName={name} {...getTableConfig(name)} {...props}/>
//       },
//       ...other
//     }
//
//     DBTableCache.set(name, result)
//   }
//
//   return result
// }

export default function (config) {
  return function (props) {
    return <DBTable {...props} {...config}/>
  }
}
