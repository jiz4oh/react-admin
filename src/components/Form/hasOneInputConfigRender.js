import _ from "lodash";

export function hasOneInputConfigRender(name, definedInputConfig = {}, fields) {
  // TODO 根据字段生成 inputConfig
  const hasOneDefaultInputConfig = {
    name,
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasOneDefaultInputConfig)
}
