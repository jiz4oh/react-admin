import _ from "lodash";

export function hasManyInputConfigRender( definedInputConfig = {}, fields) {
  // TODO 根据字段生成 inputConfig
  const hasManyDefaultInputConfig = {
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, hasManyDefaultInputConfig)
}
