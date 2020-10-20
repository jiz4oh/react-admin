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

const _logSuccess = result => logger.debug(`请求成功，响应结果：${JSON.stringify(result)}`)
const _logFail = result => logger.debug(`请求失败，响应结果：${JSON.stringify(result)}`)

function _encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function _buildURL(url, params, paramsSerializer) {
  if (!params) return url;

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
        parts.push(_encode(key) + '=' + _encode(v));
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

const _addDefaultHeaders = headers => _.defaultsDeep(headers, {Accept: 'application/json'})

const _addApiPathToUrl = (apiPath, url) => {
  apiPath = _.isUndefined(apiPath) ? defaultPath : apiPath
  // 添加 /
  url = _.startsWith(url, '/') ? url : `/${url}`
  // 判断 undefined
  url = url || ''
  return `${apiPath}${url}`
}

const _statusHandlers = {
  401: () => {
    message.error('登录出错，请重新登录')
    clearUserInfo()
  }
}

const _handleStatus = status => {
  const handler = _statusHandlers[status]
  if (_.isFunction(handler)) handler()
  return handler
}

/**
 * 基础异步请求封装
 * @options showErrorMessage: 显示默认错误消息
 * @options apiPath: api 接口后的 path 地址，默认为 defaultPath
 * @options onSuccess {Function(data, status, response)} 异步请求成功处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(响应)
 * @options onFail {Function(data, status, err)} 异步请求失败处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(错误)
 * @options 其他 axios 中的参数
 */
const asyncRequest = ({
                        showErrorMessage = true,
                        method = 'get',
                        data,
                        headers,
                        apiPath,
                        url,
                        onSuccess,
                        onFail,
                        ...others
                      }) => {
  const options = {...others}
  options.onSuccess = onSuccess || ((data, status) => {
    if (String(status).startsWith('2')) {
      _logSuccess(data);
    } else {
      _logFail(data);
      logger.warn(`网络请求出错：${status}-${data.error}`)
      showErrorMessage && message.error(`网络请求出错：${data.error}`);
    }
  })
  options.onFail = onFail || ((data, status, err) => {
    _logFail(data);
    if (axios.isCancel(data)) {
      // TODO 取消了请求后的操作
      logger.debug('axios 请求已取消')
    } else {
      if (data) {
        logger.warn(`网络请求出错：${status}-${err.message}`)
        showErrorMessage && message.error(`网络请求出错：${err.message}`);
      } else {
        logger.warn(`无法请求到网络：无法获取到 err.response`)
        showErrorMessage && message.error('请检查您的网络');
      }
    }
  })
  method.toLowerCase() === 'get' ? options.params = data : options.data = data
  options.headers = _addDefaultHeaders(headers)
  options.url = _addApiPathToUrl(apiPath, url)
  options.method = method.toLowerCase()

  try {
    axios(options).then(response => {
      response = _.cloneDeep(response)
      return onSuccess(response.data, response.status, response)
    }).catch(err => {
      const {
              response = {
                data: {error: '未知错误'},
                status: 0
              }
            } = err

      _handleStatus(response.status)
      onFail(response.data, response.status, err)
    })
  } catch (exception) {
    const {response = {}, message} = exception;
    _logFail(response);
    _handleStatus(response.status);
    message.error(`网络请求出错: ${exception.message}`);
  }
};

/**
 * 基础同步请求封装
 * @options onSuccess {Function(data, status, response)} 同步请求成功处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(响应)
 * @options onFail {Function(data, status, err)} 同步请求失败处理函数，第一参数为(响应体)，第二参数为(响应码)，第三参数为(错误)
 */
const syncRequest = (options) => {
  // 1,new
  let request = new XMLHttpRequest();
  let {method = 'get', url, headers = {}, apiPath, data, onSuccess, onFail} = options

  url = _addApiPathToUrl(apiPath, url)
  if (method.toLowerCase() === 'get') url = _buildURL(url, data);

  // 2,open
  request.open(method, url, false); // false 表示同步请求

  // 3,setHeader,get请求不需要
  headers = _addDefaultHeaders(headers)
  _.forEach(headers, (k, v) => request.setRequestHeader(k, v))

  // 4，定义返回触发的函数，定义在send之前，不然同步请求就出问题
  request.onreadystatechange = function (a) {
    const {readyState, status} = request
    const response = JSON.parse(request.response)

    // 6,通过状态确认完成
    if (readyState === 4 && String(status).startsWith('2')) {
      logger.debug(`同步请求成功，响应结果：${JSON.stringify(response)}`)

      _.isFunction(onSuccess)
        ? onSuccess(response, status, request)
        : logger.error('未正确传入 onSuccess，同步请求处理结果失败')
    } else {
      _handleStatus(response.status)
      logger.debug(`同步请求失败，响应结果：${JSON.stringify(response)}，响应码：${status}`)

      _.isFunction(onFail)
        ? onFail(response, status, request)
        : logger.error('未正确传入 onFail，同步请求处理结果失败')
    }
  };

  try {
    // 5,发送，发送内容格式"a=1&b=2"，而不是json
    request.send(_buildURL(data));
  } catch (exception) {
    const {response = {}, status, message} = request
    onFail && onFail(response, status, request)
    _logFail(response);
    _handleStatus(status);
    message.error(`网络请求出错: ${message}`);
  }
}

const getRequest = (options, async = true) => {
  options = Object.assign(options, {method: 'get'})
  return async ? asyncRequest(options) : syncRequest(options)
}

const postRequest = (options, async = true) => {
  options = Object.assign(options, {method: 'post'})
  return async ? asyncRequest(options) : syncRequest(options)
}

const putRequest = (options, async = true) => {
  options = Object.assign(options, {method: 'put'})
  return async ? asyncRequest(options) : syncRequest(options)
}

const deleteRequest = (options, async = true) => {
  options = Object.assign(options, {method: 'delete'})
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
