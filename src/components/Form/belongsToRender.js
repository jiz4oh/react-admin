import _ from "lodash";

export function belongsToRender(name, definedInputConfig = {}, collection, label) {
  if (_.isEmpty(collection)) return definedInputConfig

  // collection 钩子
  if (_.isFunction(definedInputConfig.collection)) {
    definedInputConfig.collection = definedInputConfig.collection(collection)
  }

  const belongsToDefaultInputConfig = {
    name,
    as: 'select',
    rules: [{
      required: true,
      message: `必须填写所属${label}`
    }],
    collection,
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, belongsToDefaultInputConfig)
}
