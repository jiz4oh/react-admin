/**
 * actions 组件有三种操作分类
 *
 * 1. action 对表格单条数据的操作，接受 record 作为参数，例如编辑，详情查看
 * 3. batchAction 对表格多条数据的操作，接受 records 作为参数，例如批量删除
 * 3. actionItem 对当前页面进行的操作，不接受参数，例如新建
 */

export { renderDeleteAction } from './batchActions'
export {
  renderNewAction,
  renderRefreshAction,
  renderSubmitAction,
  renderBackAction
} from './actionItems'
export { renderEditAction, renderShowAction } from './actions'

