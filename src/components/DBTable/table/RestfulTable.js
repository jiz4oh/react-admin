import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Modal, notification, Table as AntdTable } from "antd";
import _ from 'lodash'

import './index.scss'
import { actionCreators, constants } from "../store";
import Logger from "../../../common/js/Logger";
import utils from './utils'
import * as actionButtons from "../actions";
import { Filter, ToolBar } from "../index";
import { ImagePreviewModal } from "../../ImagePreviewModal";
import { RestfulModel } from "../RestfulModel";
import globalConfig from "../../../config";

const logger = Logger.getLogger('RestfulTable')

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param filter {Object[]} 过滤器字段
 * @param columns {Object[]} 列表页字段
 * @param pageSize {Number} 列表页字段
 * @param actionItems {[]} 列表页工具栏右侧按钮
 * @param batchActions {[]} 列表页工具栏左侧批量操作按钮
 * @param actions {[]} 列表页单条记录的操作按钮
 * @param defaultActionMap {{}} 默认按钮组件的映射
 * @param tableWidth {Number} 表格宽度
 * @param rowSelection {{}} 传入 antd 的表格选择项
 * @param expandable {{}} 传入 antd 的表格扩展项
 */
class RestfulTable extends React.PureComponent {
  static propTypes = {
    model: PropTypes.instanceOf(RestfulModel).isRequired,
    filter: PropTypes.array,
    columns: PropTypes.array.isRequired,
    pageSize: PropTypes.number,
    onFetchList: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    onRestList: PropTypes.func,
    actionItems: PropTypes.array,
    batchActions: PropTypes.array,
    actions: PropTypes.array,
    defaultActionMap: PropTypes.object,
    rowSelection: PropTypes.object,
    expandable: PropTypes.object,
    tableWidth: PropTypes.number,
  };

  state = {
    selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
    selectedRows: [],
    recordId: null,
    showForm: '',
  };

  componentDidMount() {
    // 从后端获取数据
    // 配置了 columns 才能显示数据，否则会显示多行白条
    !_.isEmpty(this.getColumns()) && this.fetchTableData({
                                                           page: 1
                                                         })
  }

  componentWillUnmount() {
    // 重置 store 中数据
    this.props.onRestList()
  }

  /**
   * 处理多选操作
   * @param selectedRowKeys {Number[]} 选中的 AntDesign Table 行 key
   * @param selectedRows {Object[]} 选中的 AntDesign Table 行
   */
  handleTableSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
                    selectedRowKeys,
                    selectedRows
                  });
  };

  /**
   * 从后端获取数据
   * @param params
   */
  fetchTableData = (params = {}) => {
    const {model, pageSize, onFetchList} = this.props
    params = _.defaultsDeep(params, {
      page: 1,
      size: pageSize
    })
    logger.debug('从后端获取数据。。。')
    onFetchList(
      model,
      params,
    )
  }

  /**
   * 当前组件需要使用的默认按钮组件
   * @returns {{new: (function(*): *), edit: (function(*): function(*=): *), show: (function(*): function(*=): *), refresh: (function(*): *), delete: (function(*, *=): *)}}
   */
  get defaultActionMap() {
    const {defaultActionMap: ret = {}} = this.props
    return _.defaultsDeep(ret, {
      edit: actionButtons.renderEditAction(this.handleClickEdit),
      show: actionButtons.renderShowAction(this.handleClickShow),
      delete: actionButtons.renderDeleteAction(this.handleClickDelete),
      new: actionButtons.renderNewAction(this.handleClickNew),
      refresh: actionButtons.renderRefreshAction(this.fetchTableData)
    })
  }

  /**
   * 获取表格宽度
   * @param length
   * @returns {Number}
   */
  getTableWidth = (length = this.getColumns().length) => {
    const {tableWidth} = this.props

    // 获取全表宽度
    return utils.getTableWidth(length, tableWidth)
  }

  /**
   * 设置 AntDesign 的表格
   * @returns {Object[]|}
   */
  getColumns = () => {
    const {model, columns: columnsConfig} = this.props
    // 获取表格具体列
    const columns = utils.getColumns(model, columnsConfig)
    // 添加索引列
    columns.unshift({
                      title: '#',
                      dataIndex: constants.indexColumn,
                      // 固定 # 列
                      fixed: 'left',
                      width: 130
                    })
    // 添加操作列
    const actions = this.getActions()
    !_.isEmpty(actions) && columns.push(utils.actionsColumn(actions))

    return _.cloneDeep(columns)
  }

  /**
   * 表单记录列表
   * @returns {[]}
   */
  getDataSource = () => {
    const {items = []} = this.props.list
    return items
  }

  /**
   * 设置 AntDesign 的页码属性
   * @returns {{current: Object.current, total: Object.total, onChange: RestfulTable.handlePageChange, nextPage: Object.nextPage, responsive: boolean, pageSize: Object.pageSize, prevPage: Object.prevPage, onShowSizeChange: RestfulTable.handlePageSizeChange, showQuickJumper: boolean, showSizeChanger: boolean}}
   */
  getPagination = () => {
    const {current, prevPage, nextPage, total, pageSize} = this.props.list;
    return {
      current,
      prevPage,
      nextPage,
      total,
      pageSize,
      onChange: this.handlePageChange,
      responsive: true,
      showSizeChanger: true,
      onShowSizeChange: this.handlePageSizeChange,
      showQuickJumper: true,
    }
  }

  /**
   * 单条记录的按钮
   * @returns {Function[]}
   */
  getActions = () => {
    let {actions = [], canShow = false, canEdit = true,} = this.props
    actions = _.cloneDeep(actions)

    canEdit && actions.push(this.defaultActionMap.edit)
    canShow && actions.push(this.defaultActionMap.show)
    return actions
  }

  /**
   * 多条记录的批量操作按钮
   * @returns {Function[]}
   */
  getBatchActions = () => {
    let {batchActions = [], canDelete = true} = this.props
    batchActions = _.cloneDeep(batchActions)

    canDelete && batchActions.unshift(this.defaultActionMap.delete)
    return batchActions
  }

  /**
   * 页面级别按钮
   * @returns {Function[]}
   */
  getActionItems = () => {
    let {actionItems = [], canNew = true} = this.props
    actionItems = _.cloneDeep(actionItems)

    canNew && actionItems.push(this.defaultActionMap.new)
    // 添加刷新按钮
    actionItems.push(this.defaultActionMap.refresh)
    return actionItems
  }

  // 点击按钮页
  handlePageChange = (page) => {
    logger.debug(`切换到第${page}页`)
    this.fetchTableData({
                          page
                        })
  }

  // 点击修改每页大小
  handlePageSizeChange = (page, size) => {
    logger.debug(`页码尺寸改为 ${size}`)
    this.fetchTableData({
                          size,
                        })
  }

  // 点击新建按钮
  handleClickNew = e => {
    e.preventDefault()
    logger.debug('新建')
    this.props.history.push(`${this.props.match.url}/new`)
  }

  // 点击详情按钮
  handleClickShow = record => e => {
    logger.debug(`查看 ${record.id} 的详情`)
  }

  // 点击编辑按钮
  handleClickEdit = record => e => {
    logger.debug(`编辑 ${record.id}`)
    this.props.history.push(`${this.props.match.url}/${record.id}/edit`)
  }

  // 点击删除按钮
  handleClickDelete = records => e => {
    const {model} = this.props
    e.preventDefault()
    logger.debug('删除')
    const batchKeys = records.map(o => o.id)

    Modal.confirm({
                    title: batchKeys.length > 1 ? '确认批量删除' : '确认删除',
                    content: `当前被选中的行: ${batchKeys.join(', ')}`,
                    onOk: () => {
                      if (globalConfig.debug) {
                        notification.success({
                                               message: '测试删除成功',
                                               description: `成功删除${batchKeys.length}条数据`,
                                               duration: 3,
                                             })
                      } else {
                        utils.deleteFromDb(model, batchKeys, this.fetchTableData)
                      }
                    },
                  });
  }

  render() {
    let {
          model, filter: filterFields,
          loading, rowSelection = {}, expandable
        } = this.props
    const {selectedRowKeys, selectedRows} = this.state

    // 配置默认的 rowSelection
    // 因为 selectedRowKeys 需要从 state 中获取，所以放在 render 中
    rowSelection = !_.isEmpty(this.getBatchActions()) && _.defaultsDeep(rowSelection, {
      selectedRowKeys: selectedRowKeys,
      onChange: this.handleTableSelectChange,
      checkStrictly: false
    })

    return (
      <>
        <Filter
          model={model}
          onQuery={this.fetchTableData}
          fields={filterFields}
        />

        <ToolBar
          actionItems={this.getActionItems()}
          batchActions={this.getBatchActions()}
          value={selectedRows}
        />

        <AntdTable
          rowSelection={rowSelection}
          columns={this.getColumns()}
          dataSource={this.getDataSource()}
          pagination={this.getPagination()}
          loading={loading}
          expandable={expandable}
          showSizeChanger={false}
          scroll={{
            // 设置整个表格宽度，以固定列
            x: this.getTableWidth(),
            // // 设置整个表格高度，以固定表格行
            // y: 800
          }}
        />

        <ImagePreviewModal/>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {fetchListPending, ...restState} = state.table
  return {
    loading: fetchListPending,
    list: restState
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchList: bindActionCreators(actionCreators.fetchList, dispatch),
    onRestList: bindActionCreators(actionCreators.resetList, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RestfulTable))
