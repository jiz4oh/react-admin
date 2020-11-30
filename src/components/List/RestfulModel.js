import { asyncRequest, syncRequest } from "../../utils/request"

const isDebug = process.env.REACT_APP_ENV === 'development'

/**
 * rest 风格的 model，用于和后端传输数据，封装 index show new edit create update destroy 方法
 * @param name {String} model 名，用于做缓存，i18n 查找等
 * @param url {String} 后端地址路径
 */
class RestfulModel {
  constructor(config) {
    const { name, url } = config
    this.name = name
    this.url = url
  }

  /**
   * 资源列表查询接口
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  index({ onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: this.url,
      method: 'get',
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 单个资源查询接口
   * @param pk {number} 资源索引号，通常为 id
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  show({ pk, onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: `${this.url}/${pk}`,
      method: 'get',
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 资源新建表单接口，通常用于由后端下发表单
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  new({ onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: `${this.url}/new`,
      method: 'get',
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 资源创建接口，后端需要响应 post 请求
   * @param data {Object} 需要提交的表单数据
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  create({ data, onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: this.url,
      method: 'post',
      data,
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 资源编辑表单接口
   * @param pk {Number} 资源索引号，通常为 id
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  edit({ pk, onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: `${this.url}/${pk}/edit`,
      method: 'get',
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 资源更新接口，后端需要响应 put 请求
   * @param pk {Number} 资源索引号，通常为 id
   * @param data {Object} 需要提交的表单数据
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  update({ pk, data, onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: `${this.url}/${pk}`,
      method: 'put',
      data,
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * 资源删除接口，后端需要响应 delete 请求
   * @param pk {Number} 资源索引号，通常为 id
   * @param onSuccess {Function} 成功回调
   * @param onFail {Function} 失败回调
   * @param args {any} 其他 _request 接受的参数
   * @returns {*|void}
   */
  delete({ pk, onSuccess = this._onSuccess, onFail = this._onFail, ...args }) {
    return this._request({
      url: `${this.url}/${pk}`,
      method: 'delete',
      onSuccess,
      onFail,
      ...args,
    })
  }

  /**
   * model 默认全局请求成功回调函数
   * @param data {Object} 响应结果
   * @param status {Number} 响应代码
   * @param response {Object} 完整的成功响应对象
   * @private
   */
  _onSuccess(data, status, response) {
    return console.debug('请求成功')
  }

  /**
   * model 默认全局请求失败回调函数
   * @param data {Object} 响应结果
   * @param status {Number} 响应代码
   * @param error {Object} 完整的失败响应对象
   * @private
   */
  _onFail(data, status, error) {
    return console.info('请求失败')
  }

  /**
   * 默认全局请求函数
   * @param options {Object}
   * @param async {Boolean} 是否以异步的方式发送请求
   * @private
   */
  _request(options, async = true) {
    if (isDebug) return options.onSuccess && options.onSuccess({})
    return async ? asyncRequest(options) : syncRequest(options)
  }
}

function RestfulModelFactory(name, url) {
  return new RestfulModel({
    name,
    url
  })
}

export { RestfulModel, RestfulModelFactory }
