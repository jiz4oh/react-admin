import _ from "lodash";

export function hasOneInputConfigRender(definedInputConfig = {}, fields) {
  // TODO 根据字段生成 inputConfig
  const hasOneDefaultInputConfig = {
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasOneDefaultInputConfig)
}
