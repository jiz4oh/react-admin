import {
  getSession,
  getPermission
} from "./index";

const hasPermission = permissionName =>
  tableName => {
    const permissions = getPermission(permissionName)
    return permissions.includes('all') || permissions.includes(tableName)
  }

export const isLoggedIn = getSession
export const hasIndexPermission = hasPermission('index')
export const hasShowPermission = hasPermission('show')
export const hasCreatePermission = hasPermission('create')
export const hasUpdatePermission = hasPermission('update')
export const hasDeletePermission = hasPermission('delete')

export const hasVisitPermission = (location) => {
  // 首先验证是否登录
  if (!isLoggedIn()) return false

  // 再判断权限
  // 默认所有管理员可以访问 dashboard
  if (location === '/dashboard') return true

  let locations = location.split('/')
  let permissionName = locations.pop()

  switch (permissionName) {
    case 'new':
      return hasCreatePermission(locations.pop())
    case 'edit':
      locations.pop()
      // 因为 edit 中间还有个 id，所以多 pop 一次
      return hasUpdatePermission(locations.pop())
    default:
      return hasIndexPermission(permissionName)
  }
}
