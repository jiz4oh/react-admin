import React from "react";
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import PropTypes from "prop-types";
import _ from 'lodash'

import Logger from "../../common/js/Logger";
import {
  hasShowPermission,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission
} from "../session";
import { RestfulNewForm, RestfulEditForm } from "./form";
import { RestfulTable } from "./table";
import { RestfulModel } from "./RestfulModel";

const logger = Logger.getLogger('Resource')

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param CRUD {[]} 允许的 CRUD 操作
 * @param filter {Object[]} 过滤器字段
 * @param form {Object[]} form 表单字段
 * @param index {Object[]} 列表页字段
 * @param pageSize {Number} 每页显示个数
 * @param component {ReactDOM} 列表页挂载的组件
 * @param newForm {ReactDOM} 新建页面挂载的组件
 * @param editForm {ReactDOM} 编辑页面挂载的组件
 * @param actionItems {[]} 列表页工具栏右侧按钮
 * @param batchActions {[]} 列表页工具栏左侧批量操作按钮
 * @param actions {[]} 列表页单条记录的操作按钮
 * @param restConfig 其他需要传入的参数
 * @return {*}
 */
function DBTable({
                   model,
                   CRUD,
                   filter = [],
                   form: formFields,
                   index,
                   pageSize,
                   component,
                   newForm,
                   editForm,
                   actionItems = [],
                   batchActions = [],
                   actions = [],
                   ...restConfig
                 }) {
  logger.debug(`切换到 ${model.name}`)
  const match = useRouteMatch()

  const canNew = !_.isEmpty(CRUD) && CRUD.includes('new') && hasCreatePermission(model.url)
  const canEdit = !_.isEmpty(CRUD) && CRUD.includes('edit') && hasUpdatePermission(model.url)
  const canShow = !_.isEmpty(CRUD) && CRUD.includes('show') && hasShowPermission(model.url)
  const canDelete = !_.isEmpty(CRUD) && CRUD.includes('delete') && hasDeletePermission(model.url)
  const TableComponent = component || RestfulTable
  const NewForm = newForm || RestfulNewForm
  const EditForm = editForm || RestfulEditForm

  return (
    <Switch>
      {canNew && (
        <Route
          path={`${match.path}/new`}
          key={`${match.path}/new`}
          render={() =>
            <NewForm
              model={model}
              fields={formFields}
              {...restConfig}
            />
          }
        />
      )}
      {canEdit && (
        <Route
          path={`${match.path}/:id/edit`}
          key={`${match.path}/:id/edit`}
          render={() =>
            <EditForm
              model={model}
              fields={formFields}
              {...restConfig}
            />
          }
        />
      )}
      <Route
        exec
        path={match.path}
        key={match.path}
        render={() =>
          <TableComponent
            model={model}
            filter={filter}
            columns={index}
            pageSize={pageSize}
            actionItems={actionItems}
            batchActions={batchActions}
            actions={actions}
            canNew={canNew}
            canEdit={canEdit}
            canShow={canShow}
            canDelete={canDelete}
            {...restConfig}
          />
        }
      />
    </Switch>
  )
}

DBTable.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  CRUD: PropTypes.array,
  filter: PropTypes.array,
  form: PropTypes.array,
  index: PropTypes.array,
  batchActions: PropTypes.array,
  actions: PropTypes.array,
  actionItems: PropTypes.array,
};


export default React.memo(DBTable)
