import _ from 'lodash'
import axios from 'axios'
import { message } from 'antd';

import globalConfig from '../../config'
import Logger from "./Logger";
import { isURLSearchParams } from "./utils";
import { clearUserInfo } from "../../components/session";

const logger = Logger.getLogger('apiRequest')
const defaultHost = globalConfig.api.host
const defaultPath = globalConfig.api.path

axios.defaults.baseURL = defaultHost
axios.defaults.withCredentials = true

/**
 * 基础异步请求封装
 * @options showErrorMessage: 显示错误消息，通常用在没有后续 then 调用中
 * @options isUpload: 是否上传
 * @options apiPath: api 接口后的 path 地址，默认为 defaultPath
 * @options onSuccess {Function(data, status, response)} 异步请求成功处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(响应)
 * @options onFail {Function(data, status, err)} 异步请求失败处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(错误)
 * @options 其他 axios 中的参数
 */
const asyncRequest = (options) => {
  const {
          onSuccess = (data, status) => {
            if (String(status).startsWith('2')) {
              resolve(data);
            } else {
              reject(data);
              logger.warn(`网络请求出错：${status}-${data.error}`)
              options.showErrorMessage && message.error(`网络请求出错：${data.error}`);
            }
          },
          onFail    = (data, status, err) => {
            reject(data);
            if (axios.isCancel(data)) {
              // TODO 取消了请求后的操作
              logger.debug('axios 请求已取消')
            } else {
              if (data) {
                logger.warn(`网络请求出错：${status}-${err.message}`)
                options.showErrorMessage && message.error(`网络请求出错：${err.message}`);
              } else {
                logger.warn(`无法请求到网络：无法获取到 err.response`)
                options.showErrorMessage && message.error('请检查您的网络');
              }
            }
          }
        } = options

  let headers = options.headers || {}; // Header

  if (options.method === 'get') {
    options.params = options.data;
  }

  headers['Accept'] = 'application/json'
  options.headers = headers
  const requestPath = _.isUndefined(options.apiPath) ? defaultPath : options.apiPath
  options.url = `${requestPath}${options.url || ''}`

  const resolve = (result) => {
    logger.debug(`请求成功，响应结果：${JSON.stringify(result)}`)
  }

  const reject = (result) => {
    logger.debug(`请求失败，响应结果：${JSON.stringify(result)}`)
  }

  try {
    axios(options).then(
      response => {
        response = _.cloneDeep(response)
        return onSuccess(response.data, response.status, response)
      }
    ).catch(
      err => {
        const {
                response = {
                  data: {error: '未知错误'},
                  status: 0
                }
              } = err

        if (Number(response.status) === 401) {
          message.error('登录出错，请重新登录')
          clearUserInfo()
        }

        onFail(response.data, response.status, err)
      }
    )
  } catch (exception) {
    reject(exception.response);
    message.error(`网络请求出错: ${exception.message}`);
  }
  // });
};

/**
 * 基础同步请求封装
 * @options onSuccess {Function(data, status, response)} 同步请求成功处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(响应)
 * @options onFail {Function(data, status, err)} 同步请求失败处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(错误)
 */
const syncRequest = (options) => {
  // 1,new
  let request = new XMLHttpRequest();
  // eslint-disable-next-line
  let {method, url, headers, apiPath, data, onSuccess, onFail} = options

  const requestPath = _.isUndefined(apiPath) ? defaultPath : apiPath
  url = `${defaultHost}${requestPath}${url || ''}`
  if (method === 'get' || method === 'GET') {
    url = buildURL(url, data)
  }
  // 2,open
  request.open(method, url, false); // false 表示同步请求

  // TODO 增加自定义 headers
  // 3,setHeader,get请求不需要
  request.setRequestHeader("Content-type", "application/json");

  // 4，定义返回触发的函数，定义在send之前，不然同步请求就出问题
  request.onreadystatechange = function (a) {
    const {readyState, status} = request
    const response = JSON.parse(request.response)

    // 6,通过状态确认完成
    if (readyState === 4 && String(status).startsWith('2')) {
      logger.debug(`同步请求成功，响应结果：${JSON.stringify(response)}`)

      if (!_.isFunction(onSuccess)) return logger.error('未正确传入 onSuccess，同步请求处理结果失败')

      onSuccess(response, status, request)
    } else {
      if (Number(response.status) === 401) {
        message.error('登录出错，请重新登录')
        clearUserInfo()
      }
      logger.debug(`同步请求失败，响应结果：${JSON.stringify(response)}，响应码：${status}`)

      if (!_.isFunction(onFail)) return logger.error('未正确传入 onFail，同步请求处理结果失败')

      onFail(response, status, request)
    }
  };

  try {
    // 5,发送，发送内容格式"a=1&b=2"，而不是json
    request.send(buildURL(data));
  } catch (exception) {
    onFail && onFail(request.response, request.status, request)
    message.error(`网络请求出错: ${exception.message}`);
  }
}

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }

  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    let parts = [];

    _.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (_.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      _.forEach(val, function parseValue(v) {
        if (_.isDate(v)) {
          v = v.toISOString();
        } else if (_.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    let hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

const getRequest = (options, async = true) => {
  options = Object.assign(options, {
    method: 'get'
  })

  return async ? asyncRequest(options) : syncRequest(options)
}

const postRequest = (options, async = true) => {
  options = Object.assign(options, {
    method: 'post'
  })

  return async ? asyncRequest(options) : syncRequest(options)
}

const putRequest = (options, async = true) => {
  options = Object.assign(options, {
    method: 'put'
  })

  return async ? asyncRequest(options) : syncRequest(options)
}

const deleteRequest = (options, async = true) => {
  options = Object.assign(options, {
    method: 'delete'
  })

  return async ? asyncRequest(options) : syncRequest(options)
}

export {
  asyncRequest,
  syncRequest,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
}
