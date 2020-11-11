export {
  setUserInfo,
  clearUserInfo,
  getSession,
  getPermission,
  getUserInfo
} from './session'

export {
  isLoggedIn,
  hasVisitPermission,
  hasIndexPermission,
  hasShowPermission,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission,
} from './permissions'

export { default as permissionRequired } from './permissionRequired'
