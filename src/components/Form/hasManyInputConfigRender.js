import _ from "lodash";

export function hasManyInputConfigRender(name, definedInputConfig = {}, fields) {
  // TODO 根据字段生成 inputConfig
  const hasManyDefaultInputConfig = {
    name,
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasManyDefaultInputConfig)
}
