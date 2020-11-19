import React, { useMemo } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";
import _ from 'lodash'

import Logger from "../utils/Logger";
import {
  hasShowPermission,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission
} from "../session";
import { RouteFormList } from "../components/List";
import { RestfulNewForm, RestfulEditForm } from "../components/Form";
import formUtils from "../components/Form/utils";
import globalConfig from "../config"
import PolymorphicGrid from "../lib/components/PolymorphicGrid";

const defaultCRUD = globalConfig.DBTable.CRUD || ['new', 'edit', 'delete']
const logger = Logger.getLogger('Resource')

const defaultComponentMap = {
  list: RouteFormList,
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
 * @param model {Object} 需要具有 name，url 属性
 * @param model.url {string} 用于判断 增删改查 权限
 * @param CRUD {[]} 允许的 CRUD 操作
 * @param index {Object[]} 列表页字段
 * @param form {Object[]} form 页字段
 * @param components {{}} 指定 list，new，edit 组件
 * @param children {[]|{}}
 * @param columns {Number} 将列表页分成几列，默认 1
 * @param gutter {Number|Array} 每列中的间隔大小，默认恒纵向都为 8
 * @param restConfig 其他需要传入的参数
 * @return {*}
 */
function CRUD({
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
    formUtils.notifySuccess('编辑')
    history.goBack()
  }

  const newUrl = `${match.path}/new`
  const editUrl = `${match.path}/:id/edit`

  return (
    <Switch>
      {canNew && (
        <Route
          path={newUrl}
          key={newUrl}
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
          path={editUrl}
          key={editUrl}
          render={props =>
            <EditForm
              model={model}
              fields={formFields}
              pk={props.match.params.id}
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
          <PolymorphicGrid columns={columns} gutter={gutter}>
            <List
              model={model}
              formFields={formFields}
              columns={index}
              canNew={canNew}
              canEdit={canEdit}
              canShow={canShow}
              canDelete={canDelete}
              newUrl={newUrl}
              editUrl={editUrl}
              {...restConfig}
            />
            {children}
          </PolymorphicGrid>
        }
      />
    </Switch>
  )
}

CRUD.propTypes = {
  model: PropTypes.shape({
                           index: PropTypes.func.isRequired,
                           new: PropTypes.func.isRequired,
                           create: PropTypes.func.isRequired,
                           edit: PropTypes.func.isRequired,
                           update: PropTypes.func.isRequired,
                           delete: PropTypes.func.isRequired,
                           name: PropTypes.string,
                           url: PropTypes.string.isRequired,
                         }),
  CRUD: PropTypes.array,
  form: PropTypes.array,
  index: PropTypes.array,
};

export default React.memo(CRUD)
