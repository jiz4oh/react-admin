const globalConfig = require('../config')
// 因为 babel 限制，不能读取 src 目录以外文件，所以这里不能使用需要硬编码形式指定文件路径
const i18nFile = require('../assets/i18n.json')

const locate = globalConfig.locate || 'zh-CN'
/**
 * @param path {Array} 对象的嵌套 key 数组
 * @example ["activerecord", "attributes", "commodity", "name"]
 * @return {String|Object}
 */
const findBy = (path) => {
  const current = path.pop()
  let result = i18nFile[locate]
  if (path.length !== 0) {
    result = findBy(path)
  }
  return result[current]
}

const translateMap = new Map()

/**
 * 对翻译实现缓存
 * @param path {Array} 对象的嵌套 key 数组
 * @returns {String}
 */
const byName = (path) => {
  const name = path.join('.')
  let result = translateMap.get(name)
  if (!result) {
    result = findBy(path)
    translateMap.set(name, result)
  }
  return result
}

/**
 *
 * @param name {String} 需要翻译的字符串路径，以 . 分割
 * @example 'activerecord.attributes.commodity.name'
 * @returns {String}
 */
const translate = (name) => {
  const path = name.split('.')
  const field = path[path.length - 1];
  let result = field
  try {
    result = byName(path)
  } catch (e) {
    console.info(`未找到 ${field} 对应翻译`)
  }
  return result
}

const t = translate

export default {
  t,
  translate,
}
