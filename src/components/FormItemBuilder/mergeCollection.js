import _ from "lodash";

const COLLECTION = process.env.REACT_APP_FORM_COLLECTION_KEY

/**
 * 将 COLLECTION 中的内容合并到 inputsConfig 中对应字段的 collection 属性中
 * @param inputsConfig {Object[]}
 * @param data {{COLLECTION: {}}}
 * @return {Object[]}
 */
export function mergeCollection(inputsConfig, data){
  const { [COLLECTION]: collections = {} } = data
  return _.map(inputsConfig, inputConfig => {
    const collection = collections[inputConfig.name]
    // 如果 collection 中未有当前字段的设置则返回
    if (_.isNil(collection)) return inputConfig

    const result = _.cloneDeep(inputConfig)
    // collection 钩子
    if (_.isFunction(result.collection)) {
      result.collection = result.collection(collection)
    } else {
      result.collection = collection
    }

    return result
  })
}
