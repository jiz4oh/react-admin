const yaml = require('js-yaml');
const fs = require('fs');
const i18nOutputPath = 'src/assets/i18n.json'
const i18nLocalesDir = process.env.REACT_APP_I18N_LOCALES_DIR || 'src/locales/'

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

// begin 自动构建 i18n 文件
const i18n = createI18nFileBy(i18nLocalesDir)
// 每次都重新构建文件
fs.existsSync(i18nOutputPath) && fs.unlinkSync(i18nOutputPath)
fs.writeFileSync(i18nOutputPath, JSON.stringify(i18n))
// end
