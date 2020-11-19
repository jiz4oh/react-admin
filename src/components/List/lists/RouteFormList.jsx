import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, notification, Table as AntdTable } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import _ from 'lodash'

import './index.scss'
import Logger from "../../../utils/Logger";
import utils from './utils'
import {
  renderShowAction,
  renderNewAction,
  renderRefreshAction,
  renderEditAction,
  renderDeleteAction,
} from "../index";
import { RansackFilter } from "../../RansackFilter";
import { ToolBar } from "../../ToolBar";
import globalConfig from "../../../config";

const logger = Logger.getLogger('RestfulTable')
const defaultSize = globalConfig.DBTable.pageSize || 10
const childrenColumnName = "children"
const indexColumn = "indexColumn"

/**
 *
 * @param model {Object} 需要具有 index 方法
 * @param model.index {Function}
 * @param filter {Object[]} 过滤器字段
 * @param columns {Object[]} 列表页字段
 * @param pageSize {Number} 列表页字段
 * @param actionItems {[]} 列表页工具栏右侧按钮
 * @param batchActions {[]} 列表页工具栏左侧批量操作按钮
 * @param actions {[]} 列表页单条记录的操作按钮
 * @param defaultActionMap {{}} 默认按钮组件的映射
 * @param tableWidth {Number} 表格宽度
 * @param listNeedReload {boolean} 是否需要刷新列表数据
 * @param newUrl {String} 新建按钮跳转地址， 例： /users/new
 * @param showUrl {String} 详情按钮跳转地址，可接受 :id 参数，例： /users/:id
 * @param editUrl {String} 编辑按钮跳转地址，可接受 :id 参数，例： /users/:id/edit
 */
class RouteFormList extends React.PureComponent {
  static propTypes = {
    model: PropTypes.shape({
                             index: PropTypes.func.isRequired,
                           }),
    filter: PropTypes.array,
    columns: PropTypes.array.isRequired,
    pageSize: PropTypes.number,
    actionItems: PropTypes.array,
    batchActions: PropTypes.array,
    actions: PropTypes.array,
    defaultActionMap: PropTypes.object,
    tableWidth: PropTypes.number,
    listNeedReload: PropTypes.bool,
    history: PropTypes.object,
    showUrl: PropTypes.string,
    newUrl: PropTypes.string,
    editUrl: PropTypes.string,
  };

  state = {
    selectedRowKeys: [],
    fetchListPending: false,
    listNeedReload: this.props.listNeedReload,
    fetchListError: null,
    byId: {},
    ids: [],
    items: [],
    currentPage: 1,
    prevPage: null,
    nextPage: null,
    total: null,
    pageSize: this.props.pageSize || defaultSize,
    //检测全屏状态
    isFullScreen: false,
  }

  toggleFullScreen = () => {
    this.state.isFullScreen ? utils.exitFullscreen() : utils.requestFullScreen()
    this.setState({isFullScreen: !this.state.isFullScreen})
  };

  componentDidMount() {
    // 从后端获取数据
    // 配置了 columns 才能显示数据，否则会显示多行白条
    !_.isEmpty(this.getColumns()) && this.fetchTableData({
                                                           page: 1
                                                         })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {fetchListPending, listNeedReload, pageSize, currentPage} = this.state
    // 当未在拉取数据且需要刷新列表时向后端拉取数据
    if (!fetchListPending && listNeedReload) {
      this.fetchTableData({
                            page: currentPage,
                            size: pageSize
                          })
    }
  }

  /**
   * 处理多选操作
   * @param selectedRowKeys {Number[]} 选中的 AntDesign Table 行 key
   */
  handleTableSelectChange = (selectedRowKeys) => this.setState({selectedRowKeys})

  /**
   * 从后端获取数据
   * @param params
   */
  fetchTableData = (params = {}) => {
    const {model} = this.props
    const {currentPage, pageSize} = this.state
    params = _.defaultsDeep(params, {
      page: currentPage,
      size: pageSize
    })
    logger.debug('从后端获取数据。。。')
    this.setState({
                    fetchListPending: true,
                    fetchListError: null,
                    listNeedReload: false,
                  })
    model.index(
      {
        data: params,
        showErrorMessage: true,
        onSuccess: data => {
          const {resources, pagination = {}} = data
          const {
                  current_page: currentPage,
                  prev_page: prevPage,
                  next_page: nextPage,
                  total_count: total
                } = pagination

          const byId = {};
          const ids = [];
          let num = 1
          const items = _.cloneDeep(resources)

          const handleData = arr =>
            _.forEach(arr, item => {
              item['key'] = item.id
              // 增加索引列
              item[indexColumn] = num
              num++

              // 处理表格中可能的 children 数据
              !_.isEmpty(item[childrenColumnName]) && handleData(item[childrenColumnName])

              // 创建一个 id 数组
              ids.push(item.id);
              // 可通过 id 查找每一行
              byId[item.id] = item;
            })

          handleData(items)
          this.setState({
                          byId,
                          ids,
                          items,
                          currentPage,
                          prevPage,
                          nextPage,
                          total,
                          pageSize,
                          fetchListPending: false,
                          fetchListError: null,
                        })
        },
        onFail: data => {
          this.setState({
                          fetchListPending: false,
                          fetchListError: data,
                        })
        }
      })
  }

  /**
   * 当前组件需要使用的默认按钮组件
   * @returns {{new: (function(*): *), edit: (function(*): function(*=): *), show: (function(*): function(*=): *), refresh: (function(*): *), delete: (function(*, *=): *)}}
   */
  get defaultActionMap() {
    const {defaultActionMap: ret = {}} = this.props
    return _.defaultsDeep(ret, {
      edit: renderEditAction(this.handleClickEdit),
      show: renderShowAction(this.handleClickShow),
      delete: renderDeleteAction(this.handleClickDelete),
      new: renderNewAction(this.handleClickNew),
      refresh: renderRefreshAction(e => this.setState({listNeedReload: true}))
    })
  }

  /**
   * 获取表格宽度
   * @param length
   * @returns {Number}
   */
  getTableWidth = (length = this.getColumns().length) => {
    // 获取全表宽度
    return this.props.tableWidth || utils.getTableWidth(length)
  }

  /**
   * 设置 AntDesign 的表格
   * @returns {Object[]|}
   */
  getColumns = () => {
    let {model, columns} = this.props
    // 获取表格具体列
    columns = utils.transColumns(columns, model.name)
    // 添加索引列
    columns.unshift({
                      title: '#',
                      dataIndex: indexColumn,
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
    const {items = []} = this.state
    return items
  }

  /**
   * 设置 AntDesign 的页码属性
   */
  getPagination = () => {
    const {currentPage, prevPage, nextPage, total, pageSize} = this.state;
    return {
      currentPage,
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
   * 通过指定的 key，获取对应表格记录
   * @param selectedRowKeys {Number[]} 选中的 AntDesign Table 行 key
   * @returns {Object[]} 选中的 AntDesign Table 行
   */
  getSelectedRows = (selectedRowKeys = this.state.selectedRowKeys) => {
    return this.getDataSource().filter(record => selectedRowKeys.includes(record.key))
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
    // 添加全屏按钮
    actionItems.push(
      () => (
        <Button
          key='fullScreenBtn'
          onClick={this.toggleFullScreen}
        >
          {this.state.isFullScreen ? <FullscreenExitOutlined/> :
            <FullscreenOutlined/>}
        </Button>
      )
    )
    return actionItems
  }

  // 点击按钮页
  handlePageChange = (page) => {
    logger.debug(`切换到第${page}页`)
    this.fetchTableData({page})
  }

  // 点击修改每页大小
  handlePageSizeChange = (page, size) => {
    logger.debug(`页码尺寸改为 ${size}`)
    this.fetchTableData({
                          page,
                          size
                        })
  }

  // 点击新建按钮
  handleClickNew = e => {
    e.preventDefault()
    logger.debug('新建')
    const destinationUrl = this.props.newUrl
    this.props.history.push(destinationUrl)
  }

  // 点击详情按钮
  handleClickShow = record => e => {
    logger.debug(`查看 ${record.id} 的详情`)
    const destinationUrl = _.replace(this.props.showUrl, ':id', record.id)
    this.props.history.push(destinationUrl)
  }

  // 点击编辑按钮
  handleClickEdit = record => e => {
    logger.debug(`编辑 ${record.id}`)
    const destinationUrl = _.replace(this.props.editUrl, ':id', record.id)
    this.props.history.push(destinationUrl)
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
          rowSelection = {}, expandable = {},
        } = this.props

    const {selectedRowKeys, fetchListPending} = this.state
    // 配置默认的 rowSelection
    // 因为 selectedRowKeys 需要从 state 中获取，所以放在 render 中
    rowSelection = !_.isEmpty(this.getBatchActions()) && _.defaultsDeep(rowSelection, {
      selectedRowKeys: selectedRowKeys,
      onChange: this.handleTableSelectChange,
      checkStrictly: false
    })

    expandable = _.defaultsDeep(expandable, {
      // 通过点击行来展开子行
      expandRowByClick: true,
      indentSize: 20
    })

    return (
      <>
        {
          !_.isEmpty(filterFields) && (
            <RansackFilter
              tableName={model.name}
              onQuery={this.fetchTableData}
              fields={filterFields}
            />
          )
        }

        <ToolBar
          actionItems={this.getActionItems()}
          batchActions={this.getBatchActions()}
          value={this.getSelectedRows()}
        />

        <AntdTable
          onRow={record => {
            return {
              onDoubleClick: e => {
                if (selectedRowKeys.includes(record.key)) {
                  this.handleTableSelectChange(selectedRowKeys.filter(key => key !== record.key))
                } else {
                  this.handleTableSelectChange([record.key])
                }
              },
            }
          }}
          rowSelection={rowSelection}
          columns={this.getColumns()}
          dataSource={this.getDataSource()}
          pagination={this.getPagination()}
          loading={fetchListPending}
          expandable={expandable}
          showSizeChanger={false}
          scroll={{
            // 设置整个表格宽度，以固定列
            x: this.getTableWidth(),
            // // 设置整个表格高度，以固定表格行
            // y: 800
          }}
        />
      </>
    );
  }
}


export default RouteFormList
