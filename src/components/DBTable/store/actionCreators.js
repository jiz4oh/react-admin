import _ from 'lodash'

import constants from './constants'
import { defaultState } from "./reducer";
import globalConfig from '../../../config'

const defaultSize = globalConfig.DBTable.pageSize || 10

export function resetList() {
  return {type: constants.RESET_LIST}
}

// Action creator
/**
 *
 * @param model
 * @param params {Object}
 * @returns {function(*=): Promise<unknown>}
 */
export function fetchList(model,
                          params = {
                            page: 1,
                            size: defaultSize,
                            q: []
                          },
) {
  // action
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
               type: constants.FETCH_LIST_BEGIN,
               tableName: model.name,
             })
    return new Promise((resolve, _reject) => {
      model.index({
                    data: params,
                    showErrorMessage: true,
                    onSuccess: data => {
                      const {resources, pagination = {}} = data
                      dispatch({
                                 type: constants.FETCH_LIST_SUCCESS,
                                 tableName: model.name,
                                 items: resources,
                                 current: pagination['current_page'],
                                 prevPage: pagination['prev_page'],
                                 nextPage: pagination['next_page'],
                                 total: pagination['total_count'],
                                 pageSize: params.size || defaultSize || 10,
                               })
                      resolve(data)
                    },
                    onFail: data => {
                      dispatch({
                                 type: constants.FETCH_LIST_ERROR,
                                 ..._.cloneDeep(defaultState),
                                 error: data,
                               })
                    }
                  })
    })
  }
}

export function selectRowKeys(keys) {
  return {
    type: constants.SELECT_ROW_KEYS,
    selectedRowKeys: keys
  }
}
