import constants from './constants'

export const headerChangeBreadcrumbCreator = (paths) => ({
  type: constants.CHANGE_BREADCRUMB,
  paths: paths
})