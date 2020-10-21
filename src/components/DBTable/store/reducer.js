import _ from 'lodash'

import constants, { indexColumn, childrenColumnName } from './constants'

export const defaultState = {
  fetchListPending: false,
  fetchListError: null,
  listNeedReload: false,
  tableName: null,
  byId: {},
  ids: [],
  items: [],
  current: 1,
  prevPage: null,
  nextPage: null,
  total: null,
  pageSize: 10,
  selectedRowKeys: [],
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case constants.FETCH_LIST_BEGIN:
      return {
        ...state,
        tableName: action.tableName,
        fetchListPending: true,
        fetchListError: null,
      };

    case constants.FETCH_LIST_SUCCESS: {
      const {tableName, current, prevPage, nextPage, total, pageSize} = action

      const byId = {};
      const ids = [];
      let num = 1
      const items = _.cloneDeep(action.items)

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
      return {
        ...state,
        tableName,
        byId,
        ids,
        items,
        current,
        prevPage,
        nextPage,
        total,
        pageSize,
        fetchListPending: false,
        fetchListError: null,
      };
    }

    case constants.FETCH_LIST_ERROR:
      const {type, error, ...rest} = action

      return {
        ...state,
        ...rest,
        fetchListPending: false,
        fetchListError: error,
      };

    case constants.RESET_LIST:
      return {
        ...state,
        ...defaultState
      }

    case constants.SELECT_ROW_KEYS:
      const {selectedRowKeys} = action
      return {
        ...state,
        selectedRowKeys,
      }
    default:
      return state;
  }
};

export default reducer;
