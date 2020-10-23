import React, { useMemo } from "react";
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
import globalConfig from "../../config"
import { PolymorphicLayout } from "../layouts";

const defaultCRUD = globalConfig.DBTable.CRUD || ['new', 'edit', 'delete']
const logger = Logger.getLogger('Resource')

const defaultComponentMap = {
  list: RestfulTable,
  new: RestfulNewForm,
  edit: RestfulEditForm,
}

const can = {
  new: (CRUD, url) => !_.isEmpty(CRUD) && CRUD.includes('new') && hasCreatePermission(url),
  edit: (CRUD, url) => !_.isEmpty(CRUD) && CRUD.includes('edit') && hasUpdatePermission(url),
  show: (CRUD, url) => !_.isEmpty(CRUD) && CRUD.includes('show') && hasShowPermission(url),
  delete: (CRUD, url) => !_.isEmpty(CRUD) && CRUD.includes('delete') && hasDeletePermission(url),
}

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param CRUD {[]} 允许的 CRUD 操作
 * @param index {Object[]} 列表页字段
 * @param form {Object[]} form 页字段
 * @param components {{}} 指定 list，new，edit 组件
 * @param children {[]|{}}
 * @param columns {Number} 将列表页分成几列，默认 1
 * @param gutter {Number} 每列中的间隔大小，默认 8
 * @param restConfig 其他需要传入的参数
 * @return {*}
 */
function DBTable({
                   model,
                   CRUD = defaultCRUD,
                   form: formFields,
                   index,
                   components,
                   children,
                   columns,
                   gutter,
                   ...restConfig
                 }) {
  logger.debug(`切换到 ${model.name}`)
  const match = useRouteMatch()
  const history = useHistory()

  const canNew = can.new(CRUD, model.url)
  const canEdit = can.edit(CRUD, model.url)
  const canShow = can.show(CRUD, model.url)
  const canDelete = can.delete(CRUD, model.url)

  const componentMap = useMemo(() => _.defaults(components, defaultComponentMap), [components])
  const List = componentMap.list
  const NewForm = componentMap.new
  const EditForm = componentMap.edit

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
          <PolymorphicLayout columns={columns} gutter={gutter}>
            <List
              model={model}
              formFields={formFields}
              columns={index}
              canNew={canNew}
              canEdit={canEdit}
              canShow={canShow}
              canDelete={canDelete}
              {...restConfig}
            />
            {children}
          </PolymorphicLayout>
        }
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
