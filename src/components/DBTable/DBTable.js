import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";
import _ from 'lodash'

import Logger from "../../common/js/Logger";
import {
  hasShowPermission,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission
} from "../session";
import { RestfulModel } from "./RestfulModel";
import { RestfulTable } from "./index";
import { RestfulEditForm, RestfulNewForm } from "./index";
import formUtils from "./form/utils";

const logger = Logger.getLogger('Resource')

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param CRUD {[]} 允许的 CRUD 操作
 * @param filter {Object[]} 过滤器字段
 * @param restConfig 其他需要传入的参数
 * @return {*}
 */
function DBTable({
                   model,
                   CRUD,
                   form: formFields,
                   index,
                   list,
                   newForm,
                   editForm,
                   ...restConfig
                 }) {
  logger.debug(`切换到 ${model.name}`)
  const match = useRouteMatch()
  const history = useHistory()

  const canNew = !_.isEmpty(CRUD) && CRUD.includes('new') && hasCreatePermission(model.url)
  const canEdit = !_.isEmpty(CRUD) && CRUD.includes('edit') && hasUpdatePermission(model.url)
  const canShow = !_.isEmpty(CRUD) && CRUD.includes('show') && hasShowPermission(model.url)
  const canDelete = !_.isEmpty(CRUD) && CRUD.includes('delete') && hasDeletePermission(model.url)
  const List = list || RestfulTable
  const NewForm = newForm || RestfulNewForm
  const EditForm = editForm || RestfulEditForm
  const onNewFinish = () => {
    formUtils.notifySuccess('创建')
    history.goBack()
  }

  const onEditFinish = () => {
    formUtils.notifyError('编辑')
    history.goBack()
  }

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
              onFinish={onNewFinish}
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
              onFinish={onEditFinish}
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
          <List
            model={model}
            form={formFields}
            columns={index}
            canNew={canNew}
            canEdit={canEdit}
            canShow={canShow}
            canDelete={canDelete}
            {...restConfig}
          />}
      />
    </Switch>
  )
}

DBTable.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  CRUD: PropTypes.array,
  form: PropTypes.array,
  index: PropTypes.array,
};


export default React.memo(DBTable)
