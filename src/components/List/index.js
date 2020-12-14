// lists
export { default as RouteFormList } from './lists/RouteFormList'
export { default as InnerFormList } from './lists/InnerFormList'

// actions
/**
 * actions 组件有三种操作分类
 *
 * 1. action 对表格单条数据的操作，接受 record 作为参数，例如编辑，详情查看
 * 3. batchAction 对表格多条数据的操作，接受 records 作为参数，例如批量删除
 * 3. actionItem 对当前页面进行的操作，不接受参数，例如新建
 */
export { DeleteAction } from './actions/batchActions'
export { NewAction, RefreshAction } from './actions/actionItems'
export { EditAction, ShowAction } from './actions/actions'

// renders
export { default as textRender } from "./renders/textRender"
export { default as FileRender } from "./renders/FileRender"
export { default as ImageRender } from "./renders/ImageRender"
export { default as HasManyRender } from "./renders/HasManyRender"

