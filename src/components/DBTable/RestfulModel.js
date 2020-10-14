import { asyncRequest, syncRequest } from "../../common/js/request"
import globalConfig from "../../config";

const debug = globalConfig.debug

class RestfulModel {
  constructor(config) {
    const {name, url} = config
    this.name = name
    this.url = url
  }

  index({onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: this.url,
                           method: 'get',
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  show(id, {onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: `${this.url}/${id}`,
                           method: 'get',
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  new({onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: `${this.url}/new`,
                           method: 'get',
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  create(data, {onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: this.url,
                           method: 'post',
                           data,
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  edit(id, {onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: `${this.url}/${id}/edit`,
                           method: 'get',
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  update(id, data, {onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: `${this.url}/${id}`,
                           method: 'put',
                           data,
                           onSuccess,
                           onFail,
                           ...args,
                         })
  }

  delete(id, {onSuccess = this._onSuccess, onFail = this._onFail, ...args}) {
    return this._request({
                           url: `${this.url}/${id}`,
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
    if (debug) return options.onSuccess && options.onSuccess({})
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
