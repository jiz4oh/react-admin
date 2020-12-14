const i18nFile = require('../assets/i18n.json')

const locate = process.env.REACT_APP_LOCATE

function NotFoundException(message) {
  this.message = message
}

/**
 * @param path {Array} 对象的嵌套 key 数组
 * @example ["activerecord", "attributes", "commodity", "name"]
 * @return {String|Object}
 */
const findBy = (path) => {
  const current = path.pop()
  let obj = i18nFile[locate]
  if (path.length !== 0) {
    obj = findBy(path)
  }
  const result = obj[current]
  if (!result) throw new NotFoundException(`未找到 ${current} 对应翻译`)

  return result
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
    if (e instanceof NotFoundException) {
      console.info(`未找到 ${field} 对应翻译`)
    }
  }
  return result
}

const t = translate

export default {
  t,
  translate,
}
