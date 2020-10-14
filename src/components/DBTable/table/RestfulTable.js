import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Button, Table as AntdTable } from "antd";
import _ from 'lodash'

import './index.scss'
import { actionCreators, constants } from "../store";
import Logger from "../../../common/js/Logger";
import utils from './utils'
import { Filter } from "../filter";
import { RestfulToolBar } from "../toolBar";
import { ImagePreviewModal } from "../../ImagePreviewModal";
import { RestfulModel } from "../RestfulModel";

const logger = Logger.getLogger('RestfulTable')

const editAction = onClickFn =>
  record => (
    <Button
      key='editBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      className={'C-option'}
    >
      编辑
    </Button>
  )

const showAction = onClickFn =>
  record => (
    <Button
      key='showBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      className={'C-option'}
    >
      详情
    </Button>
  )

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param filter {Object[]} 过滤器字段
 * @param columns {Object[]} 列表页字段
 * @param pageSize {Number} 列表页字段
 * @param actionItems {[]} 列表页工具栏右侧按钮
 * @param batchActions {[]} 列表页工具栏左侧批量操作按钮
 * @param actions {[]} 列表页单条记录的操作按钮
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
    rowSelection: PropTypes.object,
    expandable: PropTypes.object,
    tableWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
    };

    const {
            model,
            actions: preActions = [],
            columns             = [],
            tableWidth,
            canShow,
            canEdit,
          } = this.props

    const actions = _.cloneDeep(preActions)

    canEdit && actions.push(editAction(this.handleClickEdit))
    canShow && actions.push(showAction(this.handleClickShow))

    // 获取表格具体列
    this.columns = utils.getColumns(model, columns)
    // 添加索引列
    this.columns.unshift({
                           title: '#',
                           dataIndex: constants.indexColumn,
                           // 固定 # 列
                           fixed: 'left',
                           width: 130
                         })
    // 添加操作列
    !_.isEmpty(actions) && this.columns.push(utils.actionsColumn(actions))
    // 获取全表宽度
    this.tableWidth = utils.getTableWidth(this.columns.length, tableWidth)
  }

  componentDidMount() {
    // 从后端获取数据
    // 配置了 columns 才能显示数据，否则会显示多行白条
    !_.isEmpty(this.columns) && this.fetchTableData({
                                                      page: 1
                                                    })
  }

  componentWillUnmount() {
    // 重置 store 中数据
    this.props.onRestList()
  }

  handleTableSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  };

  // 获取数据
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

  getDataSource = () => {
    const {items = []} = this.props.list
    return items
  }

  getPagination = () => {
    const {current, prevPage, nextPage, total, pageSize} = this.props.list;
    return {
      current,
      prevPage,
      nextPage,
      total,
      pageSize,
      onChange: this.handlePageChange
    }
  }

  // 点击按钮页
  handlePageChange = (page) => {
    logger.debug(`切换到第${page}页`)
    this.fetchTableData({
                          page: page
                        })
  }

  // 点击详情按钮
  handleClickShow = (record) =>
    () => {
      logger.debug(`查看 ${record.id} 的详情`)
    }

  // 点击编辑按钮
  handleClickEdit = (record) =>
    () => {
      logger.debug(`编辑 ${record.id}`)
      this.props.history.push(`${this.props.match.url}/${record.id}/edit`)
    }

  render() {
    let {
          model, filter: filterFields,
          actionItems, batchActions, canNew, canDelete,
          loading, rowSelection = {}, expandable
        } = this.props

    const {selectedRowKeys = []} = this.state

    // 配置默认的 rowSelection
    // 因为 selectedRowKeys 需要从 state 中获取，所以放在 render 中
    rowSelection = _.defaultsDeep(rowSelection, {
      selectedRowKeys: selectedRowKeys,
      onChange: this.handleTableSelectChange,
      checkStrictly: false
    })

    return (
      <div>
        <Filter
          model={model}
          onQuery={this.fetchTableData}
          fields={filterFields}
        />

        <RestfulToolBar
          model={model}
          onRefresh={this.fetchTableData}
          actionItems={actionItems}
          batchActions={batchActions}
          batchKeys={selectedRowKeys}
          canNew={canNew}
          canDelete={canDelete}
        />

        <AntdTable
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={this.getDataSource()}
          pagination={this.getPagination()}
          loading={loading}
          expandable={expandable}
          showSizeChanger={false}
          scroll={{
            // 设置整个表格宽度，以固定列
            x: this.tableWidth,
            // // 设置整个表格高度，以固定表格行
            // y: 800
          }}
        />

        <ImagePreviewModal/>
      </div>
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
