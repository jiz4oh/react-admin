import _ from "lodash";

export function belongsToInputConfigRender(inputConfig, definedInputConfig = {}, key, label) {
  const belongsToDefaultInputConfig = {
    as: 'select',
    rules: [{
      required: true,
      message: `必须填写所属${label}`
    }],
  }
  // 获取前端已配置数据
  return _.defaultsDeep(definedInputConfig, belongsToDefaultInputConfig, inputConfig)
}
