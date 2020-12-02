import _ from "lodash";

export function hasOneInputConfigRender(name, definedInputConfig = {}, collection) {
  if (_.isEmpty(collection)) return definedInputConfig

  // collection 钩子
  if (_.isFunction(definedInputConfig.collection)) {
    definedInputConfig.collection = definedInputConfig.collection(collection)
  }
  
  // TODO 嵌套更新写入 input
  const hasOneDefaultInputConfig = {}
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasOneDefaultInputConfig)
}
