import _ from "lodash";

export function hasOneInputConfigRender(inputConfig, definedInputConfig = {}, key) {
  // TODO 根据字段生成 inputConfig
  const hasOneDefaultInputConfig = {
  }
  // 获取前端已配置数据
  return _.defaultsDeep(hasOneDefaultInputConfig, inputConfig, definedInputConfig)
}
