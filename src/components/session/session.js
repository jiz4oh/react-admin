import _ from 'lodash'

import globalConfig from '../../config'
import Session from "../../models/session";

const session = new Session()

const DEBUG = globalConfig.debug
const _cookie_name = {
  USER_INFO: globalConfig.userInfoCookieKey,
  LOGIN: globalConfig.loginCookieKey,
  PERMISSIONS: globalConfig.permissionKey
}

export function setUserInfo(permissions) {
  _setLocalStorage(_cookie_name.PERMISSIONS, permissions)
}

export function clearUserInfo() {
  session.logout({onSuccess: data => console.log('注销登录')})
  _delCookie(_cookie_name.USER_INFO)
  window.localStorage.removeItem(_cookie_name.PERMISSIONS)
}

export function getSession() {
  return _getCookie(_cookie_name.USER_INFO)
}

export function getUserInfo(info) {
  return _userInfo()[info]
}

export function getPermission(permissionName) {
  let decryptedData = _decodeData(_getLocalStorage(_cookie_name.PERMISSIONS))
  const permissions = decryptedData || {}
  return permissions[permissionName] || []
}

function _userInfo() {
  let actual = {}
  let decryptedData = _decodeData(_getCookie(_cookie_name.USER_INFO))
  if (_.isObject(decryptedData)) {
    actual = JSON.parse(JSON.parse(atob((decryptedData['_rails']['message']))))
  }
  return {
    shopId: DEBUG ? 0 : actual['shop_id'],
    userName: DEBUG ? 'debug' : actual['user_name'],
    avatar: DEBUG ? '' : actual['avatar'],
  }
}

function _decodeData(encryptedData) {
  if (!encryptedData || encryptedData === '""') return
  // base64 解密
  // eslint-disable-next-line
  const [data, sign] = encryptedData.split('--')
  return data !== '""' && JSON.parse(atob(data))
}

function _getCookie(name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return document.cookie.substring(start, end)
    }
  }
  return ''
}

function _setCookie(name, value, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = `${name}=${JSON.stringify(value)}; path=/${expire ? ';expires=' + date.toGMTString() : ''}`
}

function _delCookie(name) {
  let date = new Date()
  date.setTime(date.getTime() - 10000)
  _setCookie(name, '', date.toGMTString())
}

// eslint-disable-next-line
function _getLocalStorage(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

// eslint-disable-next-line
function _setLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}
