const yaml = require('js-yaml');
const fs = require('fs');
const globalConfig = require('../../config')
// 因为 babel 限制，不能读取 src 目录以外文件，所以这里不能使用需要硬编码形式指定文件路径
const i18nFile = require('../assets/i18n.json')

/**
 *
 * @param fileObj {Object} 需要合并的对象
 * @param result {Object} i18n 翻译文件合成的对象
 * @returns {Object} i18n 翻译文件合成的对象
 */
const recurseToI18n = (fileObj, result) => {
  Object.keys(fileObj).forEach((key) => {
    const value = fileObj[key]
    // 判断当前是不是一个对象
    if (Object.prototype.toString.call(value).slice(8, -1) === 'Object') {
      result[key] = result[key] || {}
      return recurseToI18n(value, result[key])
    }
    result[key] = value
  })
  return result
}

/**
 *
 * @param dirPath {String} 文件夹地址
 * @param result {Object} i18n 翻译文件合成的对象
 * @returns {Object} i18n 翻译文件合成的对象
 */
const recurseFilesBy = (dirPath, result) => {
  // 获取所有文件
  const files = fs.readdirSync(dirPath, (err, files) => {
    if (err) {
      console.info(`未找到 ${dirPath} 文件夹`)
      return []
    }
    // files是一个数组，每个元素是此目录下的文件或文件夹的名称
    return files
  })

  files.forEach(fileOrDir => {
    // 判断 yml 后缀
    if (fileOrDir.endsWith('.yml')) {
      let fileObj = yaml.safeLoad(fs.readFileSync(dirPath + '/' + fileOrDir, 'utf8'));
      recurseToI18n(fileObj, result)
    } else {
      recurseFilesBy(dirPath + '/' + fileOrDir, result)
    }
  })

  return result
}

/**
 *
 * @param localesDir {String} i18n 文件夹存放地址
 * @returns {Object} i18n 翻译文件合成的对象
 */
const createI18nFileBy = localesDir => recurseFilesBy(localesDir, {})

/**
 * @param path {Array} 对象的嵌套 key 数组
 * @example ["activerecord", "attributes", "commodity", "name"]
 * @return {String|Object}
 */
const findBy = (path) => {
  const current = path.pop()
  let result = i18nFile[globalConfig.locate || 'zh-CN']
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

module.exports = {
  createI18nFileBy,
  t,
  translate,
}