import _ from "lodash";

export function hasManyRender(name, definedInputConfig = {}, collection, label) {
  if (_.isEmpty(collection)) return definedInputConfig

  // collection 钩子
  if (_.isFunction(definedInputConfig.collection)) {
    definedInputConfig.collection = definedInputConfig.collection(collection)
  }
  
  // TODO 嵌套更新写入 input
  const hasManyDefaultInputConfig = {}
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasManyDefaultInputConfig)
}
